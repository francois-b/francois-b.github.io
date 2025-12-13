---
title: "AWS VPC Configuration: Building a Production-Ready Network"
date: "2024-12-12"
slug: "aws-vpc-configuration"
tags: ["aws", "vpc", "networking", "infrastructure", "featured"]
---

A well-designed VPC is the foundation of any secure AWS deployment. Yet many teams treat networking as an afterthought, creating tangled configurations that become operational nightmares. Let's build a production-ready VPC from first principles.

## The Mental Model

Think of a VPC as your own private data center in AWS. You define the IP address range, create subnets, configure routing, and control what traffic flows where. Unlike a physical data center, you can spin up isolated networks in minutes and tear them down just as fast.

The key insight: **subnets determine accessibility, not security groups**. A resource in a public subnet can have a public IP and receive internet traffic. A resource in a private subnet cannot, regardless of security group rules.

## Architecture Overview

A production VPC typically follows a multi-AZ pattern with public and private tiers:

![AWS VPC Architecture Diagram](/aws-vpc-architecture.png)

This architecture provides:

- **High availability**: Resources spread across multiple Availability Zones
- **Security isolation**: Private subnets shield databases and internal services
- **Controlled egress**: NAT Gateways allow outbound internet access from private subnets
- **Defense in depth**: Multiple layers of network controls

## Choosing Your CIDR Block

The VPC CIDR block determines your available IP addresses. Choose wisely—you can't change it later without recreating the VPC.

```
Common VPC CIDR blocks:
┌─────────────────┬────────────────┬─────────────────────────┐
│ CIDR Block      │ IP Addresses   │ Use Case                │
├─────────────────┼────────────────┼─────────────────────────┤
│ 10.0.0.0/16     │ 65,536         │ Large production VPC    │
│ 10.0.0.0/20     │ 4,096          │ Medium workloads        │
│ 10.0.0.0/24     │ 256            │ Small/dev environments  │
└─────────────────┴────────────────┴─────────────────────────┘
```

**Critical consideration**: If you plan to use VPC peering or Transit Gateway, ensure CIDR blocks don't overlap across VPCs. Many organizations adopt a convention like:

- `10.0.0.0/16` - Production
- `10.1.0.0/16` - Staging
- `10.2.0.0/16` - Development

## Creating the VPC with Terraform

Here's a complete Terraform configuration for a production VPC:

<details>
<summary>Complete Terraform VPC Configuration</summary>

```hcl
# variables.tf
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "environment" {
  description = "Environment name"
  default     = "production"
}

# vpc.tf
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
  }
}

# Internet Gateway for public subnets
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.environment}-igw"
  }
}

# Public subnets
resource "aws_subnet" "public" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.environment}-public-${var.availability_zones[count.index]}"
    Tier = "public"
  }
}

# Private subnets
resource "aws_subnet" "private" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "${var.environment}-private-${var.availability_zones[count.index]}"
    Tier = "private"
  }
}

# Elastic IPs for NAT Gateways
resource "aws_eip" "nat" {
  count  = length(var.availability_zones)
  domain = "vpc"

  tags = {
    Name = "${var.environment}-nat-eip-${count.index}"
  }
}

# NAT Gateways (one per AZ for high availability)
resource "aws_nat_gateway" "main" {
  count         = length(var.availability_zones)
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = {
    Name = "${var.environment}-nat-${var.availability_zones[count.index]}"
  }

  depends_on = [aws_internet_gateway.main]
}

# Public route table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.environment}-public-rt"
  }
}

# Private route tables (one per AZ)
resource "aws_route_table" "private" {
  count  = length(var.availability_zones)
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index].id
  }

  tags = {
    Name = "${var.environment}-private-rt-${var.availability_zones[count.index]}"
  }
}

# Route table associations
resource "aws_route_table_association" "public" {
  count          = length(var.availability_zones)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private" {
  count          = length(var.availability_zones)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}
```

</details>

### Understanding the Subnet Math

The `cidrsubnet` function calculates subnet ranges automatically:

```hcl
# Given vpc_cidr = "10.0.0.0/16"

cidrsubnet("10.0.0.0/16", 8, 0)  # → 10.0.0.0/24 (public-az1)
cidrsubnet("10.0.0.0/16", 8, 1)  # → 10.0.1.0/24 (public-az2)
cidrsubnet("10.0.0.0/16", 8, 10) # → 10.0.10.0/24 (private-az1)
cidrsubnet("10.0.0.0/16", 8, 11) # → 10.0.11.0/24 (private-az2)
```

The second argument (8) adds 8 bits to the prefix, creating /24 subnets from a /16 VPC. The third argument is the subnet index.

## Route Tables: The Traffic Directors

Route tables determine where network traffic goes. Each subnet must be associated with exactly one route table.

### Public Route Table

```
┌──────────────────┬─────────────────┐
│ Destination      │ Target          │
├──────────────────┼─────────────────┤
│ 10.0.0.0/16      │ local           │
│ 0.0.0.0/0        │ igw-xxxxx       │
└──────────────────┴─────────────────┘
```

The `0.0.0.0/0` route to the Internet Gateway makes this subnet public. Any instance with a public IP can send and receive internet traffic.

### Private Route Table

```
┌──────────────────┬─────────────────┐
│ Destination      │ Target          │
├──────────────────┼─────────────────┤
│ 10.0.0.0/16      │ local           │
│ 0.0.0.0/0        │ nat-xxxxx       │
└──────────────────┴─────────────────┘
```

Traffic to `0.0.0.0/0` goes through the NAT Gateway, allowing outbound internet access while blocking inbound connections.

## NAT Gateway Considerations

NAT Gateways are expensive (~$32/month + data processing charges) but essential for private subnet internet access. Consider these patterns:

**High Availability (Recommended)**
```
One NAT Gateway per AZ
├── Pro: No cross-AZ traffic if NAT fails
├── Pro: Better performance (no cross-AZ latency)
└── Con: Higher cost ($32 × number of AZs)
```

**Cost Optimized**
```
Single NAT Gateway
├── Pro: Lower cost ($32/month total)
├── Con: Single point of failure
└── Con: Cross-AZ data transfer charges
```

**No NAT Gateway**
```
Use VPC Endpoints instead
├── Pro: No NAT cost
├── Pro: Traffic stays on AWS network
└── Con: Only works for AWS services
```

## VPC Endpoints: Keeping Traffic Private

VPC Endpoints allow private subnets to access AWS services without going through the NAT Gateway:

```hcl
# S3 Gateway Endpoint (free)
resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.us-east-1.s3"
  vpc_endpoint_type = "Gateway"

  route_table_ids = aws_route_table.private[*].id
}

# ECR Interface Endpoints (for pulling container images)
resource "aws_vpc_endpoint" "ecr_api" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.us-east-1.ecr.api"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.private[*].id
  security_group_ids  = [aws_security_group.vpc_endpoints.id]
  private_dns_enabled = true
}

resource "aws_vpc_endpoint" "ecr_dkr" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.us-east-1.ecr.dkr"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.private[*].id
  security_group_ids  = [aws_security_group.vpc_endpoints.id]
  private_dns_enabled = true
}
```

**Gateway Endpoints** (S3, DynamoDB): Free, add routes to route tables
**Interface Endpoints** (everything else): ~$7.20/month per AZ, create ENIs in subnets

## Security Groups vs NACLs

Both filter traffic, but they work differently:

| Aspect | Security Groups | NACLs |
|--------|-----------------|-------|
| Level | Instance (ENI) | Subnet |
| State | Stateful | Stateless |
| Rules | Allow only | Allow and Deny |
| Evaluation | All rules | Rules in order |
| Default | Deny all inbound | Allow all |

**Best Practice**: Use security groups for application-level rules, NACLs for subnet-level blocks (like blocking known bad IPs).

### Security Group Example

```hcl
resource "aws_security_group" "web" {
  name_prefix = "web-"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTPS from anywhere"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description     = "HTTP from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

## Flow Logs: Network Visibility

VPC Flow Logs capture network traffic metadata for debugging and compliance:

```hcl
resource "aws_flow_log" "main" {
  vpc_id                   = aws_vpc.main.id
  traffic_type             = "ALL"
  log_destination_type     = "cloud-watch-logs"
  log_destination          = aws_cloudwatch_log_group.flow_logs.arn
  iam_role_arn             = aws_iam_role.flow_logs.arn
  max_aggregation_interval = 60

  tags = {
    Name = "${var.environment}-flow-logs"
  }
}

resource "aws_cloudwatch_log_group" "flow_logs" {
  name              = "/aws/vpc/flow-logs/${var.environment}"
  retention_in_days = 30
}
```

Flow log records show:
- Source and destination IPs
- Ports and protocols
- Packets and bytes transferred
- Accept or reject action

## Common Pitfalls

**1. Overlapping CIDR blocks**

Plan your IP addressing before creating VPCs. Overlapping ranges prevent peering.

**2. Forgetting DNS settings**

Always enable `enable_dns_hostnames` and `enable_dns_support` for service discovery to work.

**3. Single NAT Gateway**

A single NAT Gateway becomes a single point of failure. Use one per AZ in production.

**4. Over-permissive security groups**

Start with least privilege. It's easier to add rules than to audit existing ones.

**5. Not using VPC endpoints**

S3 Gateway Endpoints are free and reduce NAT Gateway data processing costs significantly.

## Debugging Connectivity Issues

When instances can't communicate, check this sequence:

```
1. Security Groups
   └── Is traffic allowed inbound on the destination?
   └── Is traffic allowed outbound from the source?

2. Route Tables
   └── Does a route exist to the destination?
   └── Is the subnet associated with the correct route table?

3. NACLs
   └── Are both inbound and outbound rules allowing traffic?
   └── Remember: NACLs are stateless

4. VPC Flow Logs
   └── Is traffic being rejected?
   └── Is traffic reaching the destination at all?
```

## Conclusion

A well-architected VPC provides the foundation for secure, scalable AWS deployments. Key takeaways:

- **Plan CIDR blocks** carefully to avoid future conflicts
- **Use multiple AZs** for high availability
- **Separate public and private tiers** based on internet accessibility needs
- **Deploy NAT Gateways per AZ** in production
- **Leverage VPC Endpoints** to reduce costs and improve security
- **Enable Flow Logs** for visibility and debugging

The upfront investment in proper VPC design pays dividends in operational simplicity and security posture.
