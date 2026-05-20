import { PrismaClient, Severity, Status, Category } from '@prisma/client';
import bcrypt from 'bcryptjs';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file::memory:?cache=shared';
}


const HOSTNAMES = [
  'finance-laptop-22', 'dev-workstation-89', 'hr-pc-04', 'sales-macbook-15',
  'prod-db-master', 'web-server-01', 'auth-service-pod', 'corp-mail-server',
  'exec-laptop-01', 'rnd-ws-03', 'billing-app-77', 'infra-dns-02'
];

const USERS = [
  'john.doe@company.com', 'alice.smith@company.com', 'admin@company.com',
  'bob.jones@company.com', 'emily.brown@company.com', 'charlie.green@company.com',
  'david.white@company.com', 'sarah.black@company.com'
];

const IPS = [
  '10.1.14.22', '192.168.1.105', '172.16.42.5', '10.0.8.140',
  '198.51.100.42', '203.0.113.88', '185.220.101.5', '82.102.23.4'
];

const PROCESS_NAMES = [
  'powershell.exe', 'cmd.exe', 'bash', 'mimikatz.exe', 'nc.exe', 'curl',
  'whoami.exe', 'svchost.exe', 'rundll32.exe', 'regsvr32.exe', 'wscript.exe'
];

const DOMAINS = [
  'bad-domain.com', 'microsoft-support-security.com', 'attacker-c2.net',
  'free-giftcards.xyz', 'malicious-payload-drop.org', 'phishing-credential-collect.com'
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

function getRandomIP(): string {
  return getRandomElement(IPS);
}

function getWeightedSeverity(): Severity {
  const rand = Math.random() * 100;
  if (rand < 45) return 'info';
  if (rand < 75) return 'low';
  if (rand < 90) return 'medium';
  if (rand < 98) return 'high';
  return 'critical';
}

function getWeightedStatus(): Status {
  const rand = Math.random() * 100;
  if (rand < 50) return 'new';
  if (rand < 85) return 'investigating';
  if (rand < 93) return 'resolved';
  return 'false_positive';
}

const MALWARE_TEMPLATES = [
  {
    title: 'Suspicious PowerShell Execution',
    description: 'A highly suspicious command-line execution of PowerShell was blocked by the endpoint protection agent.',
    source: 'endpoint-agent',
  },
  {
    title: 'Unsigned Binary Executed',
    description: 'An unsigned executable was executed in a user\'s local AppData directory.',
    source: 'endpoint-agent',
  },
  {
    title: 'Cobalt Strike Beacon Detected',
    description: 'Memory signatures matching Cobalt Strike command and control beacon were detected.',
    source: 'endpoint-agent',
  },
  {
    title: 'Mimikatz Credential Dumping Attempt',
    description: 'A known credential dumping tool was executed, trying to read LSASS memory.',
    source: 'endpoint-agent',
  },
  {
    title: 'Ransomware Behavior Detected: Rapid File Encryption',
    description: 'Rapid file modification matching ransomware pattern detected on endpoint.',
    source: 'endpoint-agent',
  },
  {
    title: 'Trojan.Generic Execution Blocked',
    description: 'The endpoint agent detected and blocked a trojan signature in a temporary directory.',
    source: 'endpoint-agent',
  }
];

const PHISHING_TEMPLATES = [
  {
    title: 'Suspicious Email Link Clicked',
    description: 'User clicked a link in an email originating from a high-risk external sender.',
    source: 'email-gateway',
  },
  {
    title: 'Credential Harvesting Page Visited',
    description: 'Network protection blocked access to a known credential harvesting page.',
    source: 'firewall',
  },
  {
    title: 'Phishing Email Blocked by Gateway',
    description: 'The email gateway detected and blocked a phishing campaign targeting multiple users.',
    source: 'email-gateway',
  },
  {
    title: 'Malicious Attachment Opened',
    description: 'An archive attachment containing a script-based installer was opened from an email client.',
    source: 'email-gateway',
  },
  {
    title: 'Lookalike Domain Accessed',
    description: 'A request to a domain designed to mimic a popular corporate SaaS service was detected.',
    source: 'firewall',
  }
];

const UNAUTHORIZED_ACCESS_TEMPLATES = [
  {
    title: 'Brute Force Login Successful',
    description: 'Multiple failed login attempts followed by a successful authentication from the same IP.',
    source: 'cloud-audit',
  },
  {
    title: 'Unauthorized API Key Usage',
    description: 'An expired or unrecognized API key was used to query administrative endpoints.',
    source: 'cloud-audit',
  },
  {
    title: 'Privileged Role Granted to Account',
    description: 'An administrative user granted a high-privilege IAM role to an inactive account.',
    source: 'cloud-audit',
  },
  {
    title: 'Access Attempt from Blocked Country',
    description: 'An authentication attempt was detected from a country designated as high risk.',
    source: 'cloud-audit',
  },
  {
    title: 'Active Directory User Added to Domain Admins',
    description: 'A new member was added to the highly privileged Domain Admins group.',
    source: 'endpoint-agent',
  }
];

const DATA_EXFILTRATION_TEMPLATES = [
  {
    title: 'Large Data Transfer Detected',
    description: 'An endpoint transferred an unusually large volume of data to an external network address.',
    source: 'firewall',
  },
  {
    title: 'Database Dump Exported to External IP',
    description: 'A database export command was executed, and the resulting file was sent via SFTP.',
    source: 'firewall',
  },
  {
    title: 'Abnormal Cloud Storage Upload',
    description: 'A sudden burst of multi-gigabyte uploads to a public cloud storage service was detected.',
    source: 'cloud-audit',
  },
  {
    title: 'Massive File Download from Sharepoint',
    description: 'A user account downloaded a large number of sensitive files in a short time frame.',
    source: 'cloud-audit',
  },
  {
    title: 'DNS Tunneling Query Pattern',
    description: 'Suspiciously structured DNS queries indicating potential data encapsulation and leakage.',
    source: 'firewall',
  }
];

const POLICY_VIOLATION_TEMPLATES = [
  {
    title: 'USB Storage Device Mounted',
    description: 'A USB storage device was plugged into a workstation in violation of standard corporate policy.',
    source: 'endpoint-agent',
  },
  {
    title: 'Tor Browser Installation Detected',
    description: 'An installation or execution of the Tor Browser client was flagged by endpoint audit.',
    source: 'endpoint-agent',
  },
  {
    title: 'P2P File Sharing Client Installed',
    description: 'BitTorrent or similar peer-to-peer file sharing protocol activity detected.',
    source: 'endpoint-agent',
  },
  {
    title: 'Mining Software Executed on Server',
    description: 'A cryptocurrency mining utility was detected running on a production web server.',
    source: 'endpoint-agent',
  },
  {
    title: 'SaaS App Data Export Policy Violation',
    description: 'Export of customer contacts or proprietary data was initiated by a non-authorized user.',
    source: 'cloud-audit',
  }
];

const SUSPICIOUS_LOGIN_TEMPLATES = [
  {
    title: 'Impossible Travel Login',
    description: 'Authentication from two distant geographical locations in a timeframe shorter than travel time.',
    source: 'cloud-audit',
  },
  {
    title: 'Multiple Failed Login Attempts',
    description: 'A series of authentication failures followed by account lockout occurred in quick succession.',
    source: 'cloud-audit',
  },
  {
    title: 'Login from New Device and Location',
    description: 'A successful authentication occurred from a device and location not previously associated with this user.',
    source: 'cloud-audit',
  },
  {
    title: 'MFA Prompt Fatigue / Spamming',
    description: 'Multiple consecutive multi-factor authentication requests sent to the user\'s mobile device.',
    source: 'cloud-audit',
  },
  {
    title: 'Admin Session Created Outside Business Hours',
    description: 'An administrative console session was established during non-working hours from a residential IP.',
    source: 'cloud-audit',
  }
];

const CATEGORIES: Category[] = [
  'malware',
  'phishing',
  'unauthorized_access',
  'data_exfiltration',
  'policy_violation',
  'suspicious_login'
];

function getTemplateForCategory(category: Category) {
  switch (category) {
    case 'malware': return getRandomElement(MALWARE_TEMPLATES);
    case 'phishing': return getRandomElement(PHISHING_TEMPLATES);
    case 'unauthorized_access': return getRandomElement(UNAUTHORIZED_ACCESS_TEMPLATES);
    case 'data_exfiltration': return getRandomElement(DATA_EXFILTRATION_TEMPLATES);
    case 'policy_violation': return getRandomElement(POLICY_VIOLATION_TEMPLATES);
    case 'suspicious_login': return getRandomElement(SUSPICIOUS_LOGIN_TEMPLATES);
  }
}

function generateRawEvent(category: Category, hostname: string, user: string, ip: string, processName: string) {
  const pid = Math.floor(Math.random() * 8000) + 1000;
  const externalIp = getRandomIP();
  const domain = getRandomElement(DOMAINS);

  switch (category) {
    case 'malware':
      return {
        ip: ip,
        hostname: hostname,
        user: user.split('@')[0],
        process: {
          name: processName,
          pid: pid,
          path: processName.endsWith('.exe') ? `C:\\Windows\\System32\\${processName}` : `/usr/bin/${processName}`,
          command_line: `${processName} -ExecutionPolicy Bypass -d ${domain}`
        }
      };
    case 'phishing':
      return {
        recipient: user,
        sender: `no-reply@${domain}`,
        subject: "Urgent Action Required: Security Alert",
        email_id: `msg-${Math.floor(Math.random() * 900000) + 100000}`,
        links: [
          {
            url: `http://${domain}/login`,
            reputation: "malicious"
          }
        ]
      };
    case 'unauthorized_access':
      return {
        ip: externalIp,
        user: user,
        authentication_method: "password",
        status: "success",
        target_resource: "AWS::IAM::Role",
        failures_before_success: Math.floor(Math.random() * 15) + 5
      };
    case 'data_exfiltration':
      return {
        ip: ip,
        hostname: hostname,
        user: user.split('@')[0],
        destination_ip: externalIp,
        bytes_transferred: Math.floor(Math.random() * 50 * 1024 * 1024 * 1024) + 2 * 1024 * 1024 * 1024,
        protocol: "HTTPS",
        port: 443
      };
    case 'policy_violation':
      return {
        ip: ip,
        hostname: hostname,
        user: user.split('@')[0],
        device_details: {
          vendor: "SanDisk",
          product: "Cruzer Blade",
          serial: `SN-${Math.floor(Math.random() * 90000000) + 10000000}`
        },
        action: "mounted"
      };
    case 'suspicious_login':
      return {
        ip: externalIp,
        user: user,
        geo: {
          country: getRandomElement(['North Korea', 'Russia', 'Iran', 'China', 'Unknown']),
          city: "Unknown"
        },
        previous_login: {
          ip: "192.168.1.100",
          country: "United States",
          time: new Date(Date.now() - 3600 * 1000).toISOString()
        }
      };
  }
}

function getAffectedAsset(category: Category, hostname: string, user: string, ip: string): string {
  if (category === 'malware' || category === 'policy_violation') {
    return hostname;
  }
  if (category === 'phishing' || category === 'suspicious_login') {
    return user;
  }
  return Math.random() > 0.5 ? ip : hostname;
}

/**
 * Seed function exported for use by the Express server on startup.
 * With in-memory SQLite, this runs every time the server starts.
 */
export async function seed(prisma: PrismaClient) {
  console.log('🌱 Seeding in-memory database...');

  // Clean up any existing data (idempotent startup)
  console.log('Cleaning up existing data...');
  await prisma.alert.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating SOC Analyst account...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const analyst = await prisma.user.create({
    data: {
      email: 'analyst@soc.com',
      passwordHash: hashedPassword,
      name: 'SOC Analyst',
    },
  });
  console.log(`Created analyst user: ${analyst.email} (Password: password123)`);

  console.log('Generating 1000 security alerts...');
  const alertsToCreate: any[] = [];
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < 1000; i++) {
    const category = getRandomElement(CATEGORIES);
    const template = getTemplateForCategory(category);
    const severity = getWeightedSeverity();
    const status = getWeightedStatus();

    const hostname = getRandomElement(HOSTNAMES);
    const user = getRandomElement(USERS);
    const ip = getRandomIP();
    const processName = getRandomElement(PROCESS_NAMES);

    const timestamp = new Date(Date.now() - Math.random() * thirtyDaysMs);
    const affectedAsset = getAffectedAsset(category, hostname, user, ip);
    const rawEvent = generateRawEvent(category, hostname, user, ip, processName);

    let assignee: string | null = null;
    if (status === 'resolved' || status === 'false_positive') {
      assignee = 'SOC Analyst';
    } else if (status === 'investigating') {
      assignee = Math.random() > 0.3 ? 'SOC Analyst' : null;
    }

    alertsToCreate.push({
      timestamp,
      title: template.title,
      severity,
      status,
      category,
      source: template.source,
      affectedAsset,
      assignee,
      description: template.description,
      rawEvent,
    });
  }

  // Create in batches of 100
  const batchSize = 100;
  for (let i = 0; i < alertsToCreate.length; i += batchSize) {
    const batch = alertsToCreate.slice(i, i + batchSize);
    await prisma.alert.createMany({
      data: batch,
    });
  }

  console.log('✅ Seeding completed successfully!');
}

// Allow running as a standalone script
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  const prisma = new PrismaClient();
  seed(prisma)
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
