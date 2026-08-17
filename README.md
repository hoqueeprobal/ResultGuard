# 🛡️ ResultGuard

**Academic Result Generation, Authentication & Verification**

ResultGuard is a browser-based academic result verification system that enables universities to **generate and digitally sign academic results**, while organizations can independently **verify their authenticity and integrity** using **RSA-2048, RSA-PSS, and SHA-256**.

---

## Project Objective

The objective of ResultGuard is to demonstrate how **digital signatures and public-key cryptography** can be applied to academic records to ensure their **authenticity and integrity**.

The project provides a simple verification process through which digitally signed results can be independently validated and unauthorized modifications can be detected.

---

## Features

- **Academic Result Generation** — Generate student results with semester-wise CGPA, overall CGPA, grade, and result status.
- **Digital Result Signing** — Sign generated academic results using RSA-2048 and RSA-PSS.
- **SHA-256 Integrity Protection** — Generate cryptographic hashes to maintain result integrity.
- **Result Verification** — Independently verify the authenticity of digitally signed results.
- **Tamper Detection** — Detect unauthorized modifications to signed result data.
- **Result & Signature Export** — Download generated results and their corresponding digital signatures.

---

## Learning Outcomes

This project demonstrates practical understanding of:

- **Applied Cryptography** — RSA-2048, RSA-PSS, SHA-256, digital signatures, public-key cryptography, and data integrity.
- **Secure Verification** — Result authentication, tamper detection, role-based workflows, and browser-based cryptographic operations using the Web Crypto API.

---

## Cryptographic Components

ResultGuard uses the following cryptographic components:

| Component | Purpose |
|---|---|
| **RSA-2048** | Public-key cryptography |
| **RSA-PSS** | Digital signature scheme |
| **SHA-256** | Cryptographic hashing |
| **Web Crypto API** | Browser-native cryptographic operations |
| **Salt Length: 32 bytes** | RSA-PSS signature configuration |

### Signing Process

When the Admin generates a result, the system creates a standardized representation of the academic result. A SHA-256 hash is generated from the result data, and the result is digitally signed using the RSA private key with RSA-PSS. The generated signature i****ported along with the result.

### Verification Process

When an Organization uploads a result and its signature, the system uses the trusted RSA public key to verify the digital signature. The verification process checks whether the uploaded result matches the originally signed data. If the signature is valid, the result is considered authentic; otherwise, the result may have been modified or tampered with.

---

## Application Panels

### Admin / University Panel

The Admin panel provides the core result-generation functionality:

- **Student Information** — Enter student name, ID, department, and academic details.
- **Semester Management** — Add and manage semester-wise academic records.
- **CGPA Calculation** — Calculate overall CGPA from semester results.
- **Grade & Result Generation** — Automatically determine grade and PASS/FAIL status.
- **Digital Signing** — Generate SHA-256 hash and digitally sign the completed result using RSA-PSS.
- **Result Export** — Download the generated result and corresponding digital signature.

### Organization / Verifier Panel

The Organization panel allows an authorized verifier to:

- **Upload Result File** — Upload the academic result `.txt` file.
- **Upload Signature File** — Upload the corresponding digital signature `.sig` file.
- **Verify Signature** — Verify the authenticity of the submitted result.
- **Check Result Integrity** — Determine whether the result data has been modified.
- **View Verification Status** — Display whether the result is authentic or potentially tampered.

---

## Project Structure

```text
ResultGuard/
│
├── index.html                  # Landing page
├── login.html                  # User login page
├── admin.html                  # Admin/University result generation panel
├── organization.html           # Organization result verification panel
│
├── assets/
│   └── resultguard-hero.png    # Project hero image
│
├── js/
│   ├── app.js                  # Application functionality
│   ├── auth.js                 # Authentication and session management
│   ├── crypto.js               # RSA-PSS signing, verification, and SHA-256 hashing
│   ├── login.js                # Login page functionality
│   ├── admin.js                # Result generation and CGPA calculation
│   └── organization.js         # Result and signature verification
│
└── README.md                   # Project documentation
```

---

## Demo Credentials

The project currently uses demonstration credentials for the two roles.

### Admin / University

```text
Username: admin
Password: admin123
```

### Organization / Verifier

```text
Username: organization
Password: org123
```

---

## Technology Stack

### Frontend

- HTML5
- Tailwind CSS
- JavaScript
- Lucide Icons

### Cryptography

- Web Crypto API
- RSA-2048
- RSA-PSS
- SHA-256
- JSON Web Key (JWK)

### Browser Storage

- `sessionStorage`

No external backend or database is required for the current demonstration.

---

## License

This project is intended for educational and demonstration purposes.

You may modify and extend the project for learning, academic projects, and experimentation.
