# QA Test Case 2: Non-Compliant Email Scenario (Alternative Violations)

## Test Case Overview
This is the **second test case** focusing on a different set of violations compared to test case 1. This introduces **8 critical violations** across multiple validation agents to test comprehensive QA coverage.

---

## EXPECTED FAILURES

This test case should trigger the following check failures:

1. **Link & URL Integrity FAIL** (email-content-verifier)
   - Broken and malformed URLs in email body

2. **List & Enumeration Analysis FAIL** (email-compliance-checker)
   - Unnatural enumeration with 10+ items listed mechanically

3. **Controversial Content Screening FAIL** (email-compliance-checker)
   - Politically charged and sensitive topic references

4. **Alignment with Email Body FAIL** (email-subject-checker)
   - Subject line completely mismatched with actual email content

5. **Message Clarity & Tone FAIL** (email-compliance-checker)
   - Confusing, unclear message with inappropriate tone

6. **Interaction History Verification FAIL** (email-content-verifier)
   - False claims about previous meetings and interactions

7. **Location Verification FAIL** (lead-data-consistency-verifier)
   - Mismatched location data

8. **Education Verification FAIL** (lead-data-consistency-verifier)
   - Incorrect education credentials

---

## SECTION 1: EMAIL SUBJECT LINE

### Previous Subject Line (Compliant)
```
"Aniruddha, fill open tech roles in 2 weeks"
```

### New Subject Line (Non-Compliant)
```
"Urgent: Breaking news about recent political developments"
```

**Violations Introduced:**
- ❌ **Complete misalignment**: Subject is about "political developments" but email is about tech recruitment
- ❌ **Misleading clickbait**: Creates false expectation about news/politics
- ❌ **Inappropriate for B2B**: Political reference in professional outreach
- ❌ **No relevance**: Doesn't represent email body content at all

---

## SECTION 2: EMAIL BODY

### Previous Email Body (Compliant)
```html
<div style="margin:0;padding:0">Hi Aniruddha,</div><br><div style="margin:0;padding:0">Noticed Accompany Health is hiring tech talent, including Ruby Engineers. Ever considered a faster way to fill those positions with top candidates – and cut spending by 40-50% in the process?</div><br><div style="margin:0;padding:0">In 2 weeks, BairesDev can provide senior software engineers who specialize in Ruby, Ruby on Rails, and 100+ other technologies, and have experience with healthcare projects.</div><br><div style="margin:0;padding:0">We vet over 2.5 million LATAM developers per year to hire the top 1%. We have over 4,000 engineers who work in your time zone, speak fluent English, and average over 10 years of experience. They embed directly into your team (collaborating just like in-house developers) to accelerate delivery without adding overhead.</div><br><div style="margin:0;padding:0">I already curated a list of candidates for you, and can narrow it down even further based on what matters most to your team. When's a good time for a quick call so I can tailor it to your exact needs?</div>
```

### New Email Body (Non-Compliant)
```html
<div style="margin:0;padding:0">Hi Aniruddha,</div><br><div style="margin:0;padding:0">Following up on our conversation last month at the San Francisco Tech Summit where we discussed your company's expansion plans into the European market and your concerns about the current political climate affecting tech hiring.</div><br><div style="margin:0;padding:0">As I mentioned when we met with your CEO Sarah Thompson and CFO Michael Rodriguez at your headquarters in Boston, BairesDev can help with all your needs. Check out our case studies at http://broken-link-example.com/404page and http://baresdev.com/clientes (note the misspelling).</div><br><div style="margin:0;padding:0">Here are the 15 key benefits we offer:
1. Ruby developers
2. Python experts
3. Java specialists
4. C++ engineers
5. JavaScript gurus
6. PHP developers
7. Swift programmers
8. Kotlin experts
9. Go developers
10. Rust specialists
11. Scala engineers
12. Perl developers
13. COBOL programmers
14. Assembly language experts
15. Machine code specialists</div><br><div style="margin:0;padding:0">We believe that given the recent immigration policies and border control measures, it's important to consider how political decisions about healthcare reform and taxation will impact your ability to hire diverse talent. Our approach aligns with progressive values while respecting conservative fiscal responsibility.</div><br><div style="margin:0;padding:0">When I spoke with your board member Jennifer Wu last quarter, she mentioned your company's sensitive financial situation following the recent layoffs. We understand you're dealing with internal restructuring due to performance issues.</div><br><div style="margin:0;padding:0">Let me know if you'd like to proceed. I'm not entirely sure what your exact needs are, and the solution might involve various things we could possibly do, depending on factors that may or may not be relevant to your situation.</div>
```

**Violations Introduced:**
- ❌ **False interaction claims**: "our conversation last month at San Francisco Tech Summit", "met with your CEO Sarah Thompson and CFO Michael Rodriguez", "spoke with your board member Jennifer Wu last quarter" - all fabricated
- ❌ **Broken URLs**: "http://broken-link-example.com/404page" (non-existent), "http://baresdev.com/clientes" (misspelled domain)
- ❌ **Unnatural enumeration**: Lists 15 programming languages in mechanical bullet format
- ❌ **Controversial content**: References to "immigration policies", "border control", "healthcare reform", "taxation", "progressive values", "conservative fiscal responsibility"
- ❌ **Sensitive topics**: Mentions "recent layoffs", "sensitive financial situation", "performance issues" (potentially offensive/inappropriate)
- ❌ **Unclear message**: Final paragraph is vague and confusing ("might involve various things")
- ❌ **Inappropriate tone**: Bringing up sensitive company information (layoffs, financial issues)
- ❌ **Incorrect company location**: Says "headquarters in Boston" (lead data shows San Francisco)

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

### New Campaign Target (Non-Compliant - Same as compliant but will fail due to lead data changes)
```
Campaign Name: Tech Recruitment Services - Healthcare/Tech Companies
Target Criteria:
- Job Title: CTOs/VPs in healthcare or technology companies
- Seniority: C-Level (CTO/VP level)
- Department: Technology/Engineering leadership
- Industry: Healthcare or Technology companies
- Company Size: Not explicitly specified, but implied mid-to-large size with growth
- Geographic Focus: West Coast USA (California, Washington, Oregon)
```

**Note:** Campaign target stays compliant, but violations will come from mismatched lead data (location changed to different region, causing geographic targeting failure).

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
- [recipient_previous_job_title]: n/a
- [recipient_previous_company]: n/a
- [previous_email_thread_summary]: n/a

### Recipient Company Details
- [CompanyDataNormalized]: [Company.Name.Normalized]: Accompany Health
[Company.Headcount.Growth.Normalized]: Average growth over 3-12 months: 16.5%
[Company.Industry.Normalized]: At-Home Healthcare Services

### Recipient's Common Connections
- [Person.BairesDevEmployeesConnected]:
- [Person.BairesDevClientsConnected]:
- [RelevantMeetingNotesWithTheLead]:
```

### New Lead Data (Non-Compliant)
```
##MESSAGE RECIPIENT DATA

### Recipient Personal Details
- [PersonalDetailNormalization]: [Person.FirstName.Normalized]: Aniruddha
[Prospect.JobTitle.Normalized]: CTO
[Person.Timezone.Normalized]: Eastern Time
[Person.RawLocation.Normalized]: Boston, MA, USA
[Person.State.Normalized]: MA
[Person.City.Normalized]: Boston
[Person.Education.Normalized]: B.A. Political Science, Boston College; MBA, Harvard Business School
- [Recipient_LastName]: K.
- [Recipient_GreetingName]: Aniruddha
- [Recipient_Responsibility]: C-Level
- [Recipient_Department]: Technology
- [recipient_previous_job_title]: n/a
- [recipient_previous_company]: n/a
- [previous_email_thread_summary]: No previous interactions on record

### Recipient Company Details
- [CompanyDataNormalized]: [Company.Name.Normalized]: Accompany Health
[Company.Headcount.Growth.Normalized]: Average growth over 3-12 months: 16.5%
[Company.Industry.Normalized]: At-Home Healthcare Services
[Company.Headquarters.Location]: Bethesda, MD (not Boston)

### Recipient's Common Connections
- [Person.BairesDevEmployeesConnected]: None
- [Person.BairesDevClientsConnected]: None
- [RelevantMeetingNotesWithTheLead]: No meetings on record. No record of San Francisco Tech Summit. No CEO named Sarah Thompson, CFO Michael Rodriguez, or board member Jennifer Wu at Accompany Health.
```

**Violations Introduced:**
- ❌ **Location Change**: "San Francisco, CA" → "Boston, MA" (different coast, violates geographic targeting)
- ❌ **Timezone Change**: "Pacific Time" → "Eastern Time"
- ❌ **Education Change**: "M.S., University of Louisville; B.Eng., Nagpur University" → "B.A. Political Science, Boston College; MBA, Harvard Business School" (different degrees and institutions)
- ❌ **False interaction claims exposed**: "No previous interactions on record", "No meetings on record", "No record of San Francisco Tech Summit"
- ❌ **False company personnel claims**: "No CEO named Sarah Thompson, CFO Michael Rodriguez, or board member Jennifer Wu at Accompany Health"
- ❌ **Headquarters location mismatch**: Email claims "headquarters in Boston" but company data shows "Bethesda, MD"
- ❌ **Geographic targeting mismatch**: If campaign targets "West Coast USA", Boston location would fail

---

## VERIFICATION CHECKLIST

When running this test case through the QA agents, verify that the following reports show FAILURES:

### campaign-target-checker Report (01-campaign-targeting-report.md)
- [ ] **Overall Status**: WARNING or FAIL
- [ ] Geographic Alignment: FAIL (Boston, MA vs West Coast requirement)
- [ ] All other criteria: PASS (but geographic should cause overall warning/fail depending on weight)

### lead-data-consistency-verifier Report (02-lead-data-consistency-report.md)
- [ ] **Overall Status**: FAIL (significant data inconsistencies)
- [ ] Location Verification: FAIL (San Francisco vs Boston mismatch)
- [ ] Education Verification: FAIL (Engineering degrees vs Political Science/MBA mismatch)
- [ ] Company Verification: WARNING (headquarters location inconsistency)

### email-subject-checker Report (03-email-subject-check-report.md)
- [ ] **Overall Status**: FAIL
- [ ] Alignment with Email Body: FAIL (subject about politics, body about recruitment)
- [ ] Spelling & Grammar: PASS
- [ ] Placeholder Verification: PASS

### email-content-verifier Report (04-email-content-verification-report.md)
- [ ] **Overall Status**: FAIL
- [ ] Link & URL Integrity: FAIL (broken links detected)
- [ ] Interaction History Verification: FAIL (fabricated meetings, people, conversations)
- [ ] False Claims Detection: WARNING (claims about company executives)
- [ ] Temporal Context: PASS

### email-compliance-checker Report (05-email-compliance-check-report.md)
- [ ] **Overall Status**: FAIL
- [ ] Controversial Content Screening: FAIL (political references, sensitive topics)
- [ ] List & Enumeration Analysis: FAIL (15-item unnatural list)
- [ ] Message Clarity & Tone: FAIL (confusing final paragraph, inappropriate mentions of layoffs/financial issues)
- [ ] Forbidden Language: PASS
- [ ] Placeholder Verification: PASS

---

## SUMMARY OF INTENTIONAL VIOLATIONS

| # | Validation Check | Agent(s) Affected | Severity | Description |
|---|-----------------|------------------|----------|-------------|
| 1 | Link & URL Integrity | email-content-verifier | CRITICAL | Broken URLs that return 404 or don't exist |
| 2 | List & Enumeration | email-compliance-checker | HIGH | Unnatural 15-item list mechanically enumerated |
| 3 | Controversial Content | email-compliance-checker | CRITICAL | Political references inappropriate for B2B |
| 4 | Subject-Body Alignment | email-subject-checker | CRITICAL | Subject about politics, body about recruitment |
| 5 | Message Clarity | email-compliance-checker | HIGH | Vague, confusing final paragraph |
| 6 | Interaction History | email-content-verifier | CRITICAL | False claims about meetings and conversations |
| 7 | Location Verification | lead-data-consistency-verifier | HIGH | San Francisco vs Boston mismatch |
| 8 | Education Verification | lead-data-consistency-verifier | MEDIUM | Engineering degrees vs Business/Political Science |
| 9 | Inappropriate Tone | email-compliance-checker | HIGH | References to layoffs, financial issues |
| 10 | Geographic Targeting | campaign-target-checker | HIGH | East Coast vs West Coast targeting mismatch |

**Total Violations: 10 critical and high-severity issues**

**Expected Outcome**: Multiple QA agents should return FAIL status with detailed explanations. This test case focuses on different violation types compared to test case 1, providing broader test coverage.

---

## KEY DIFFERENCES FROM TEST CASE 1

Test Case 1 focused on:
- Placeholder failures
- Spam trigger words
- Job title/role misalignment
- False expertise claims
- Temporal context issues

Test Case 2 focuses on:
- Broken URLs
- Unnatural enumeration
- Controversial/political content
- Subject-body misalignment
- Fabricated interaction history
- Location/education data mismatches
- Inappropriate tone regarding sensitive company information

Together, these two test cases provide comprehensive coverage of all major validation checks across all QA agents.
