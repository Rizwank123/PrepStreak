import type { TopicContent } from '../../types';

export const ec2Content: TopicContent = {
  slug: 'aws/ec2', title: 'AWS EC2', category: 'aws',
  theory: `# AWS EC2\n\nElastic Compute Cloud — virtual machines in AWS.\n\n## Instance Types\n\n| Family | Optimised For | Example |\n|--------|-------------|--------|\n| t3/t4g | General (burstable) | Web servers |\n| m6i | General purpose balanced | App servers |\n| c6i | Compute | High CPU workloads |\n| r6i | Memory | In-memory DBs, caches |\n| i3 | Storage (NVMe SSD) | NoSQL DBs |\n| p3/g4 | GPU | ML inference |\n\n## Pricing Models\n\n| Model | Discount | Use When |\n|-------|---------|----------|\n| On-Demand | 0% | Variable/unpredictable |\n| Reserved (1yr) | ~40% | Steady-state workload |\n| Reserved (3yr) | ~60% | Long-term commitment |\n| Spot | ~70–90% | Fault-tolerant, flexible |\n| Savings Plans | Up to 66% | Flexible commitment |\n\n## Key Concepts\n\n- **AMI** — Amazon Machine Image, OS + software snapshot\n- **Security Group** — stateful firewall, inbound/outbound rules\n- **Key Pair** — SSH access to instances\n- **Elastic IP** — static public IP that can be reassigned\n- **User Data** — bootstrap script on launch\n- **Instance Metadata** — http://169.254.169.254/latest/meta-data/\n- **Placement Groups** — cluster (low latency), spread (HA), partition\n`,
  examples: `# EC2 — Examples\n\n## Instance Metadata in Go\n\n\`\`\`go\nresp, err := http.Get("http://169.254.169.254/latest/meta-data/instance-id")\n// Returns the EC2 instance ID\n\`\`\`\n\n## User Data Script\n\n\`\`\`bash\n#!/bin/bash\napt-get update\napt-get install -y nginx\nsystemctl start nginx\n\`\`\``,
  patterns: `# EC2 Patterns\n\n## 1. Auto Scaling Group + Load Balancer — scale horizontally\n## 2. Spot + On-Demand mix — cost-optimised ASG\n## 3. Launch Template — standardise instance configuration\n## 4. User Data — bootstrap applications at launch\n## 5. Placement Group — cluster for HPC, spread for critical single instances`,
  interviewTips: `# Interview Tips — EC2\n\n1. Know when to use Reserved vs Spot vs On-Demand.\n2. Security groups are stateful — return traffic is automatically allowed.\n3. NACL (Network ACL) is stateless — must explicitly allow return traffic.\n4. Use IMDSv2 (token-based) for instance metadata — more secure.`,
  commonMistakes: `# Common Mistakes — EC2\n\n1. Using On-Demand for all instances — expensive.\n2. Opening 0.0.0.0/0 to SSH (port 22) — major security risk.\n3. Not using IAM role — hardcoding credentials instead.\n4. No termination protection on critical instances.`,
  revision: `# EC2 — Quick Revision\n\n| Concept | Key |\n|---------|-----|\n| Security Group | Stateful, attached to instance |\n| NACL | Stateless, subnet level |\n| Spot Instance | Up to 90% cheaper, can be interrupted |\n| Reserved Instance | 1 or 3 year commitment |\n| AMI | Snapshot of OS + software |\n`,
  codeExamples: [],
  resources: [
    { title: 'AWS EC2 Documentation', url: 'https://docs.aws.amazon.com/ec2/index.html', type: 'docs', free: true },
    { title: 'EC2 Pricing', url: 'https://aws.amazon.com/ec2/pricing/', type: 'docs', free: true },
    { title: 'EC2 — FreeCodeCamp', url: 'https://www.freecodecamp.org/news/aws-ec2-explained/', type: 'article', free: true },
  ],
  quiz: [
    { id: 'ec2-q1', question: 'For unpredictable, fault-tolerant batch workloads, which pricing model saves most?', options: ['On-Demand', 'Reserved', 'Spot Instances', 'Savings Plans'], correctIndex: 2, explanation: 'Spot Instances use spare AWS capacity at up to 90% discount. They can be interrupted, making them ideal for stateless, fault-tolerant batch jobs that can retry.' },
    { id: 'ec2-q2', question: 'Security Groups are:', options: ['Stateless packet filters', 'Stateful firewalls — allow return traffic automatically', 'Applied at subnet level', 'AWS Organizations features'], correctIndex: 1, explanation: 'Security Groups track connection state. If you allow inbound SSH, the return packets are automatically allowed without needing an explicit outbound rule.' },
    { id: 'ec2-q3', question: 'An AMI contains:', options: ['EC2 pricing', 'OS, application code, and configuration snapshot', 'VPC configuration', 'IAM policies'], correctIndex: 1, explanation: 'AMI (Amazon Machine Image) is a snapshot of an EC2 instance including OS, installed software, and settings. Used to launch identical instances rapidly.' },
    { id: 'ec2-q4', question: 'User Data scripts on EC2 run:', options: ['On every reboot', 'Only on first launch', 'Every 5 minutes', 'When manually triggered'], correctIndex: 1, explanation: 'By default, User Data scripts run only on the first launch. They\'re used for bootstrapping — installing software, configuring the instance, starting services.' },
  ],
  questions: [],
};
