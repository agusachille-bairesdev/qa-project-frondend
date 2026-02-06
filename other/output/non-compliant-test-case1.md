# QA Test Case: Non-Compliant Email Scenario

## Test Case Overview
This test case intentionally introduces **7 critical violations** across multiple validation agents to test the QA system's ability to detect and flag non-compliant email content.

---

## EXPECTED FAILURES

This test case should trigger the following check failures:

1. **Placeholder Verification FAIL** (email-subject-checker & email-compliance-checker)
   - Unreplaced merge tags in subject line

2. **Job Title Alignment FAIL** (campaign-target-checker)
   - Lead's job title completely misaligned with campaign target

3. **Forbidden Language Check FAIL** (email-compliance-checker)
   - Spam trigger words and excessive exclamation points

4. **False Claims Detection FAIL** (email-content-verifier)
   - Unverifiable false expertise claims

5. **Temporal Context Validation FAIL** (email-content-verifier)
   - Outdated time-sensitive references

6. **Company Size Alignment FAIL** (campaign-target-checker)
   - Campaign targeting criteria mismatched with lead's company

7. **Spelling & Grammar FAIL** (email-subject-checker)
   - Spelling errors in subject line

---

## SECTION 1: EMAIL SUBJECT LINE

### Previous Subject Line (Compliant)
```
"Aniruddha, fill open tech roles in 2 weeks"
```

### New Subject Line (Non-Compliant)
```
"{{FIRST_NAME}}, FREE Limited-Time Ofer!!! Fill Roles in 2 Weeks ACT NOW!!!"
```

**Violations Introduced:**
- ❌ **Unreplaced placeholder**: `{{FIRST_NAME}}`
- ❌ **Spelling error**: "Ofer" instead of "Offer"
- ❌ **Spam trigger words**: "FREE", "Limited-Time", "ACT NOW"
- ❌ **Excessive punctuation**: Three exclamation marks
- ❌ **Length issue**: 67 characters (borderline too long)

---

## SECTION 2: EMAIL BODY

### Previous Email Body (Compliant)
```html
<div style="margin:0;padding:0">Hi Aniruddha,</div><br><div style="margin:0;padding:0">Noticed Accompany Health is hiring tech talent, including Ruby Engineers. Ever considered a faster way to fill those positions with top candidates – and cut spending by 40-50% in the process?</div><br><div style="margin:0;padding:0">In 2 weeks, BairesDev can provide senior software engineers who specialize in Ruby, Ruby on Rails, and 100+ other technologies, and have experience with healthcare projects.</div><br><div style="margin:0;padding:0">We vet over 2.5 million LATAM developers per year to hire the top 1%. We have over 4,000 engineers who work in your time zone, speak fluent English, and average over 10 years of experience. They embed directly into your team (collaborating just like in-house developers) to accelerate delivery without adding overhead.</div><br><div style="margin:0;padding:0">I already curated a list of candidates for you, and can narrow it down even further based on what matters most to your team. When's a good time for a quick call so I can tailor it to your exact needs?</div>
```

### New Email Body (Non-Compliant)
```html
<div style="margin:0;padding:0">Hi {{RECIPIENT_NAME}},</div><br><div style="margin:0;padding:0">Happy New Year 2020!!! I hope this message finds you well during these unprecedented times!</div><br><div style="margin:0;padding:0">Noticed Accompany Health is hiring tech talent, including Ruby Engineers. Ever considered a faster way to fill those positions with top candidates – and cut spending by 40-50% in the process? ACT NOW before this LIMITED TIME OFFER expires!!!</div><br><div style="margin:0;padding:0">In 2 weeks, BairesDev can provide senior software engineers who specialize in Ruby, Ruby on Rails, nuclear engineering, aerospace manufacturing, civil construction, and 100+ other technologies. We have experience with healthcare projects, automotive assembly plants, and sanitation management systems.</div><br><div style="margin:0;padding:0">We vet over 2.5 million LATAM developers per year to hire the top 1%. We have over 4,000 engineers who work in your time zone, speak fluent English, and average over 10 years of experience. They embed directly into your team (collaborating just like in-house developers) to accelerate delivery without adding overhead.</div><br><div style="margin:0;padding:0">Our recent partnership with Tesla Motors and NASA has proven our expertise in advanced manufacturing and space exploration technologies. We also worked with Enron Corporation on their energy trading platforms.</div><br><div style="margin:0;padding:0">I already curated a list of candidates for you, and can narrow it down even further based on what matters most to your team. When's a good time for a quick call so I can tailor it to your exact needs? GUARANTEE 100% satisfaction or your money back FREE trial!!!</div>
```

**Violations Introduced:**
- ❌ **Unreplaced placeholder**: `{{RECIPIENT_NAME}}`
- ❌ **Outdated temporal reference**: "Happy New Year 2020" (message date is 29-12-2025)
- ❌ **Spam trigger words**: "ACT NOW", "LIMITED TIME OFFER", "GUARANTEE", "FREE trial"
- ❌ **Excessive exclamation marks**: Multiple instances of "!!!"
- ❌ **False claims**: "nuclear engineering", "aerospace manufacturing", "civil construction", "automotive assembly plants", "sanitation management systems"
- ❌ **Blacklist entity**: "Enron Corporation" (defunct, controversial company)
- ❌ **Unverifiable partnerships**: "Tesla Motors", "NASA"
- ❌ **Irrelevant job positions**: Nuclear engineering, civil construction, sanitation management

---

## SECTION 3: CAMPAIGN TARGET

### Previous Campaign Target (Compliant)
```
Campaign Name: Tech Recruitment Services - Healthcare/Tech Companies
Target Criteria:
- Job Title: CTOs/VPs in healthcare or technology companies
- Seniority: C-Level (CTO/VP level)
- Department: Technology/Engineering leadership
- Industry: Healthcare or Technology companies
- Company Size: Not explicitly specified, but implied mid-to-large size with growth
```

### New Campaign Target (Non-Compliant)
```
Campaign Name: Tech Recruitment Services - Large Enterprise Manufacturing
Target Criteria:
- Job Title: Facility Managers and Operations Directors in manufacturing
- Seniority: Mid-level management (Manager to Director level)
- Department: Operations, Facilities Management, or Manufacturing
- Industry: Heavy Manufacturing, Industrial Production, or Automotive
- Company Size: 5,000+ employees (large enterprise only)
```

**Violations Introduced:**
- ❌ **Job Title Mismatch**: Targeting "Facility Managers and Operations Directors" vs lead is "CTO"
- ❌ **Seniority Mismatch**: Targeting "Mid-level management" vs lead is "C-Level"
- ❌ **Department Mismatch**: Targeting "Operations/Facilities/Manufacturing" vs lead is "Technology"
- ❌ **Industry Mismatch**: Targeting "Heavy Manufacturing/Industrial/Automotive" vs lead is "At-Home Healthcare Services"
- ❌ **Company Size Mismatch**: Targeting "5,000+ employees" vs Accompany Health shows 16.5% growth (likely much smaller)

---

## SECTION 4: LEAD DATA USED BY ATHENA

### Previous Lead Data (Compliant)
```
##MESSAGE RECIPIENT DATA

### Recipient Personal Details
- [PersonalDetailNormalization]: [Person.FirstName.Normalized]: Aniruddha
[Prospect.JobTitle.Normalized]: CTO
[Person.Timezone.Normalized]: Pacific Time
[Person.RawLocation.Normalized]: San Francisco, CA, USA
[Person.State.Normalized]: CA
[Person.City.Normalized]: San Francisco
[Person.Education.Normalized]: M.S., University of Louisville; B.Eng., Nagpur University
- [Recipient_LastName]: K.
- [Recipient_GreetingName]: Aniruddha
- [Recipient_Responsibility]: C-Level
- [Recipient_Department]: Technology

### Recipient Company Details
- [CompanyDataNormalized]: [Company.Name.Normalized]: Accompany Health
[Company.Headcount.Growth.Normalized]: Average growth over 3-12 months: 16.5%
[Company.Industry.Normalized]: At-Home Healthcare Services
```

### New Lead Data (Non-Compliant)
```
##MESSAGE RECIPIENT DATA

### Recipient Personal Details
- [PersonalDetailNormalization]: [Person.FirstName.Normalized]: Aniruddha
[Prospect.JobTitle.Normalized]: Sanitation Operations Manager
[Person.Timezone.Normalized]: Eastern Time
[Person.RawLocation.Normalized]: Detroit, MI, USA
[Person.State.Normalized]: MI
[Person.City.Normalized]: Detroit
[Person.Education.Normalized]: High School Diploma, Detroit Public Schools; Sanitation Certification, Michigan Technical Institute
- [Recipient_LastName]: K.
- [Recipient_GreetingName]: Aniruddha
- [Recipient_Responsibility]: Mid-Level Management
- [Recipient_Department]: Facilities and Operations

### Recipient Company Details
- [CompanyDataNormalized]: [Company.Name.Normalized]: Midwest Industrial Manufacturing Corp
[Company.Headcount.Growth.Normalized]: 8,500 employees, stable headcount
[Company.Industry.Normalized]: Heavy Industrial Manufacturing and Automotive Parts Production
```

**Violations Introduced:**
- ❌ **Job Title Change**: "CTO" → "Sanitation Operations Manager" (completely unrelated to tech recruitment)
- ❌ **Location Change**: "San Francisco, CA" → "Detroit, MI" (different timezone and region)
- ❌ **Education Change**: "M.S., University of Louisville; B.Eng., Nagpur University" → "High School Diploma" with sanitation certification
- ❌ **Responsibility Change**: "C-Level" → "Mid-Level Management"
- ❌ **Department Change**: "Technology" → "Facilities and Operations"
- ❌ **Company Change**: "Accompany Health" → "Midwest Industrial Manufacturing Corp"
- ❌ **Company Size Change**: Growth of 16.5% (small/medium) → "8,500 employees" (large enterprise)
- ❌ **Industry Change**: "At-Home Healthcare Services" → "Heavy Industrial Manufacturing and Automotive Parts Production"

---

## VERIFICATION CHECKLIST

When running this test case through the QA agents, verify that the following reports show FAILURES:

### campaign-target-checker Report (01-campaign-targeting-report.md)
- [ ] **Overall Status**: FAIL
- [ ] Job Title Alignment: FAIL (Sanitation Manager vs CTO/VP requirement)
- [ ] Company/Industry Alignment: FAIL (Manufacturing vs Healthcare/Tech requirement)
- [ ] Seniority Alignment: FAIL (Mid-Level vs C-Level requirement)
- [ ] Department Alignment: FAIL (Facilities/Operations vs Technology requirement)
- [ ] Company Size Alignment: FAIL (8,500 employees vs growth-stage implied)

### lead-data-consistency-verifier Report (02-lead-data-consistency-report.md)
- [ ] **Overall Status**: FAIL or WARNING (significant data inconsistencies)
- [ ] Job Title Verification: FAIL (if external source shows CTO but DB shows Sanitation Manager)
- [ ] Company Verification: FAIL (if external source shows Accompany Health but DB shows Midwest Industrial)
- [ ] Location Verification: FAIL (if external source shows San Francisco but DB shows Detroit)
- [ ] Education Verification: FAIL (if external source shows M.S./B.Eng. but DB shows High School)

### email-subject-checker Report (03-email-subject-check-report.md)
- [ ] **Overall Status**: FAIL
- [ ] Spelling & Grammar: FAIL ("Ofer" misspelling)
- [ ] Placeholder Verification: FAIL ({{FIRST_NAME}} unreplaced)
- [ ] Length & Readability: WARNING (67 characters, borderline)

### email-content-verifier Report (04-email-content-verification-report.md)
- [ ] **Overall Status**: FAIL
- [ ] False Claims Detection: FAIL (nuclear engineering, aerospace, NASA partnership, etc.)
- [ ] Blacklist Compliance: FAIL (Enron Corporation mentioned)
- [ ] Job Position Relevance: FAIL (sanitation, civil construction positions mentioned)
- [ ] Temporal Context Validation: FAIL ("Happy New Year 2020" when message date is 2025)

### email-compliance-checker Report (05-email-compliance-check-report.md)
- [ ] **Overall Status**: FAIL
- [ ] Placeholder Verification: FAIL ({{RECIPIENT_NAME}} unreplaced)
- [ ] Forbidden Language Check: FAIL (FREE, ACT NOW, LIMITED TIME OFFER, GUARANTEE)
- [ ] Spelling & Grammar: WARNING (multiple issues if body checked)
- [ ] Message Clarity & Tone: WARNING (too aggressive/salesy)

---

## SUMMARY OF INTENTIONAL VIOLATIONS

| # | Validation Check | Agent(s) Affected | Severity | Description |
|---|-----------------|------------------|----------|-------------|
| 1 | Placeholder Verification | email-subject-checker, email-compliance-checker | CRITICAL | Unreplaced {{FIRST_NAME}} and {{RECIPIENT_NAME}} |
| 2 | Job Title Alignment | campaign-target-checker | CRITICAL | CTO → Sanitation Manager (complete mismatch) |
| 3 | Forbidden Language | email-compliance-checker | CRITICAL | Multiple spam trigger words |
| 4 | False Claims | email-content-verifier | CRITICAL | Nuclear engineering, NASA, Tesla false expertise |
| 5 | Temporal Context | email-content-verifier | HIGH | "Happy New Year 2020" in 2025 email |
| 6 | Company Size | campaign-target-checker | HIGH | 5,000+ requirement vs growth-stage company |
| 7 | Spelling & Grammar | email-subject-checker | MEDIUM | "Ofer" instead of "Offer" |
| 8 | Blacklist Compliance | email-content-verifier | CRITICAL | Enron Corporation mentioned |
| 9 | Industry Alignment | campaign-target-checker | CRITICAL | Healthcare vs Manufacturing mismatch |
| 10 | Irrelevant Job Positions | email-content-verifier | HIGH | Sanitation, civil construction in tech email |

**Total Violations: 10+ critical and high-severity issues**

**Expected Outcome**: All QA agents should return FAIL status with detailed explanations of the violations detected.
