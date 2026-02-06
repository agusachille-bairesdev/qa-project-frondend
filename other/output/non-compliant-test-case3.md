# QA Test Case 3: Non-Compliant Email Scenario (Untested Validation Checks)

## Test Case Overview
This is the **third test case** focusing on validation checks that were NOT covered in test cases 1 and 2. This introduces **8 critical violations** targeting previously untested validation dimensions.

---

## EXPECTED FAILURES

This test case should trigger the following check failures (prioritizing untested items):

1. **Hidden Unicode Character Detection FAIL** (email-subject-checker & email-compliance-checker)
   - Zero-width spaces and invisible formatting characters

2. **Spacing & Formatting Check FAIL** (email-compliance-checker)
   - Excessive whitespace and poor formatting

3. **Personalization Quality FAIL** (email-compliance-checker)
   - Inaccurate personalization that contradicts lead data

4. **Logical Flow & Coherence FAIL** (email-compliance-checker)
   - Disjointed structure with non-sequiturs

5. **Length & Readability FAIL** (email-compliance-checker & email-subject-checker)
   - Overly verbose content and extremely short subject

6. **Department Alignment FAIL** (campaign-target-checker)
   - Extreme department mismatch

7. **Seniority Alignment FAIL** (campaign-target-checker)
   - Wrong seniority level targeting

8. **Company Verification FAIL** (lead-data-consistency-verifier)
   - Company name variations/subsidiary confusion

---

## SECTION 1: EMAIL SUBJECT LINE

### Previous Subject Line (Compliant)
```
"Aniruddha, fill open tech roles in 2 weeks"
```

### New Subject Line (Non-Compliant)
```
"Hi​​​there"
```

**Note:** The subject line contains three zero-width spaces (U+200B) between "Hi" and "there" that are invisible but present in the text.

**Violations Introduced:**
- ❌ **Hidden Unicode Characters**: Contains zero-width spaces (U+200B) - invisible characters
- ❌ **Too Short**: Only 8 visible characters (optimal is 30-60 characters)
- ❌ **Word Count**: Only 1-2 words (optimal is 4-9 words)
- ❌ **Poor Readability**: Vague and provides no context or value proposition
- ❌ **Mobile Unfriendly**: Too brief to be meaningful in mobile preview

---

## SECTION 2: EMAIL BODY

### Previous Email Body (Compliant)
```html
<div style="margin:0;padding:0">Hi Aniruddha,</div><br><div style="margin:0;padding:0">Noticed Accompany Health is hiring tech talent, including Ruby Engineers. Ever considered a faster way to fill those positions with top candidates – and cut spending by 40-50% in the process?</div><br><div style="margin:0;padding:0">In 2 weeks, BairesDev can provide senior software engineers who specialize in Ruby, Ruby on Rails, and 100+ other technologies, and have experience with healthcare projects.</div><br><div style="margin:0;padding:0">We vet over 2.5 million LATAM developers per year to hire the top 1%. We have over 4,000 engineers who work in your time zone, speak fluent English, and average over 10 years of experience. They embed directly into your team (collaborating just like in-house developers) to accelerate delivery without adding overhead.</div><br><div style="margin:0;padding:0">I already curated a list of candidates for you, and can narrow it down even further based on what matters most to your team. When's a good time for a quick call so I can tailor it to your exact needs?</div>
```

### New Email Body (Non-Compliant)
```html
<div style="margin:0;padding:0">Hi​Aniruddha,</div><br><br><br><br><br><div style="margin:0;padding:0">I hope this email finds you well in your role as Chief Marketing Officer at Google in New York City where you've been working for the past 15 years in the Sales department, having graduated from Yale University with a degree in Finance back in 1995.</div><br><br><br><div style="margin:0;padding:0">Speaking of which, I wanted to reach out because our team has been thinking about various opportunities and possibilities that might be relevant to different types of organizations, and we thought it would be interesting to discuss how companies in general are approaching things nowadays, especially when it comes to technology and innovation and digital transformation initiatives that are happening across various industries in today's rapidly evolving business landscape where change is constant and adaptation is key.</div><br><br><br><br><div style="margin:0;padding:0">By the way, have you ever considered quantum computing? We also work with blockchain. Also, artificial intelligence. Machine learning too. And don't forget about cloud computing, edge computing, fog computing, serverless architecture, microservices, containerization, Kubernetes orchestration, DevOps methodologies, Agile frameworks, and continuous integration and continuous deployment pipelines.</div><br><br><br><div style="margin:0;padding:0">I remember when I was working on a completely different project last year that had nothing to do with your industry, and it made me think about how interesting it is that weather patterns can affect business decisions, which reminds me that I should probably mention that we have a sale on consulting services, although I'm not sure if that's what you need.</div><br><br><br><br><br><div style="margin:0;padding:0">What I'm trying to say is that there are many different ways we could potentially work together, or maybe not, depending on what you're looking for, which I'm not entirely sure about at this point, but I thought I'd reach out anyway to see if there might be some kind of synergy or alignment or partnership opportunity that could make sense for both parties involved in this potential business relationship that we might or might not be able to establish.</div><br><br><br><div style="margin:0;padding:0">Let me know your thoughts when you get a chance, or don't, whatever works best for you.</div><br><br><br><br><br><br><div style="margin:0;padding:0">Thanks,<br>The Team</div>
```

**Note:** The greeting "Hi​Aniruddha" contains a zero-width space (U+200B) between "Hi" and "Aniruddha" that is invisible.

**Violations Introduced:**

1. **Hidden Unicode Characters**: Zero-width space in greeting line
2. **Excessive Spacing**: 3-6 line breaks between paragraphs (optimal is 1-2)
3. **Inaccurate Personalization**:
   - Says "Chief Marketing Officer" but lead is CTO
   - Says "at Google" but lead is at Accompany Health
   - Says "in New York City" but lead is in San Francisco
   - Says "Sales department" but lead is in Technology department
   - Says "graduated from Yale University with a degree in Finance back in 1995" but lead has M.S. from University of Louisville and B.Eng. from Nagpur University
   - Says "working for the past 15 years" - unverified claim

4. **Overly Verbose**: ~350 words (optimal for cold outreach is 75-200 words)
5. **Poor Readability**: Complex, run-on sentences that are hard to scan
6. **Logical Flow Issues**:
   - Paragraph 2 is rambling and says nothing concrete
   - Paragraph 3 abruptly jumps to listing technologies with no context
   - Paragraph 4 is a complete non-sequitur about weather patterns and unrelated projects
   - Paragraph 5 is vague and uncertain ("might or might not")

7. **Unclear Message**: No clear value proposition or call-to-action
8. **Inappropriate Tone**: Uncertain ("I'm not entirely sure"), unprofessional ("or don't, whatever works")
9. **Missing Key Information**: Doesn't mention the lead's actual hiring needs (Ruby Engineers)
10. **Generic Ending**: "The Team" instead of a personal signature

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
Campaign Name: Marketing Services - Retail & Consumer Goods
Target Criteria:
- Job Title: Marketing Managers and Brand Managers
- Seniority: Mid-level management (Manager level, non-executive)
- Department: Marketing, Brand Management, or Customer Engagement
- Industry: Retail, Consumer Packaged Goods, or E-commerce
- Company Size: 500-2,000 employees (mid-market companies)
```

**Violations Introduced:**
- ❌ **Job Title Mismatch**: Targeting "Marketing Managers" vs lead is "CTO"
- ❌ **Seniority Mismatch**: Targeting "Mid-level management" vs lead is "C-Level"
- ❌ **Department Mismatch**: Targeting "Marketing/Brand Management" vs lead is "Technology"
- ❌ **Industry Mismatch**: Targeting "Retail/Consumer Goods" vs lead is "Healthcare"
- ❌ **Company Size Mismatch**: Targeting "500-2,000 employees" (mid-market specific range)
- ❌ **Campaign Type Mismatch**: "Marketing Services" campaign but emailing a CTO about tech recruitment

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
[Prospect.JobTitle.Normalized]: Marketing Manager
[Person.Timezone.Normalized]: Eastern Time
[Person.RawLocation.Normalized]: New York, NY, USA
[Person.State.Normalized]: NY
[Person.City.Normalized]: New York
[Person.Education.Normalized]: B.A. Finance, Yale University, 1995
- [Recipient_LastName]: K.
- [Recipient_GreetingName]: Aniruddha
- [Recipient_Responsibility]: Mid-Level Management
- [Recipient_Department]: Sales and Marketing
- [Years_At_Company]: 15 years

### Recipient Company Details
- [CompanyDataNormalized]: [Company.Name.Normalized]: Accompany Health Inc.
[Company.Parent.Organization]: Alphabet Inc. (Google parent company)
[Company.Headcount.Normalized]: 1,200 employees
[Company.Industry.Normalized]: Healthcare Technology and Consumer Health Products
[Company.Headquarters.Location]: New York, NY
```

**Violations Introduced:**
- ❌ **Job Title Change**: "CTO" → "Marketing Manager" (different function and seniority)
- ❌ **Location Change**: "San Francisco, CA" → "New York, NY" (opposite coast)
- ❌ **Timezone Change**: "Pacific Time" → "Eastern Time"
- ❌ **Education Change**: "M.S., University of Louisville; B.Eng., Nagpur University" → "B.A. Finance, Yale University, 1995"
- ❌ **Responsibility Change**: "C-Level" → "Mid-Level Management"
- ❌ **Department Change**: "Technology" → "Sales and Marketing"
- ❌ **Company Name Variation**: "Accompany Health" → "Accompany Health Inc." (legal entity variation)
- ❌ **False Parent Company**: Added "Alphabet Inc. (Google parent company)" - Accompany Health is NOT owned by Google/Alphabet
- ❌ **Company Size Added**: "1,200 employees" (specific number)
- ❌ **Headquarters Mismatch**: Shows "New York, NY" but actual headquarters is "Bethesda, MD"
- ❌ **Industry Variation**: "At-Home Healthcare Services" → "Healthcare Technology and Consumer Health Products"

---

## VERIFICATION CHECKLIST

When running this test case through the QA agents, verify that the following reports show FAILURES:

### campaign-target-checker Report (01-campaign-targeting-report.md)
- [ ] **Overall Status**: FAIL
- [ ] Job Title Alignment: FAIL (Marketing Manager vs CTO/VP requirement)
- [ ] Seniority Alignment: FAIL (Mid-level vs C-Level requirement)
- [ ] Department Alignment: FAIL (Marketing vs Technology requirement)
- [ ] Industry Alignment: FAIL (Retail/Consumer Goods vs Healthcare/Tech requirement)
- [ ] Company Size Alignment: FAIL (1,200 employees vs 500-2,000 mid-market requirement - borderline but still mismatch)

### lead-data-consistency-verifier Report (02-lead-data-consistency-report.md)
- [ ] **Overall Status**: FAIL
- [ ] Job Title Verification: FAIL (CTO vs Marketing Manager - major discrepancy)
- [ ] Company Verification: WARNING or FAIL (legal entity variation, false parent company, headquarters mismatch)
- [ ] Location Verification: FAIL (San Francisco vs New York)
- [ ] Education Verification: FAIL (Engineering degrees vs Finance degree, different universities)

### email-subject-checker Report (03-email-subject-check-report.md)
- [ ] **Overall Status**: FAIL
- [ ] Hidden Unicode Characters: FAIL (zero-width spaces detected)
- [ ] Length & Readability: FAIL (only 8 characters, 1-2 words - far too short)
- [ ] Spelling & Grammar: PASS
- [ ] Placeholder Verification: PASS
- [ ] Alignment with Body: WARNING (vague subject doesn't represent rambling body well)

### email-content-verifier Report (04-email-content-verification-report.md)
- [ ] **Overall Status**: WARNING or FAIL
- [ ] False Claims Detection: WARNING (many unverifiable claims about weather patterns, quantum computing, etc.)
- [ ] Interaction History: PASS (no false interaction claims)
- [ ] Link & URL Integrity: PASS (no links present)
- [ ] Temporal Context: PASS

### email-compliance-checker Report (05-email-compliance-check-report.md)
- [ ] **Overall Status**: FAIL
- [ ] Unicode & Hidden Character Check: FAIL (zero-width space in greeting)
- [ ] Spacing & Formatting Check: FAIL (excessive whitespace with 3-6 line breaks)
- [ ] Personalization Quality: FAIL (all personalization is inaccurate - wrong title, company, location, education)
- [ ] Logical Flow & Coherence: FAIL (disjointed paragraphs, non-sequiturs, rambling)
- [ ] Length & Readability: FAIL (350+ words, overly verbose, poor readability)
- [ ] Message Clarity & Tone: FAIL (unclear value proposition, uncertain tone, unprofessional)
- [ ] Spelling & Grammar: PASS (grammatically correct, just poorly structured)
- [ ] Placeholder Verification: PASS
- [ ] Forbidden Language: PASS
- [ ] List & Enumeration: WARNING (paragraph 3 lists many technologies but not in bullet format)
- [ ] Controversial Content: PASS

---

## SUMMARY OF INTENTIONAL VIOLATIONS

| # | Validation Check | Agent(s) Affected | Severity | Description |
|---|-----------------|------------------|----------|-------------|
| 1 | Hidden Unicode Characters | email-subject-checker, email-compliance-checker | CRITICAL | Zero-width spaces in subject and body |
| 2 | Spacing & Formatting | email-compliance-checker | HIGH | Excessive whitespace (3-6 line breaks) |
| 3 | Personalization Quality | email-compliance-checker | CRITICAL | All personalization contradicts lead data |
| 4 | Logical Flow & Coherence | email-compliance-checker | CRITICAL | Disjointed, rambling, non-sequiturs |
| 5 | Length & Readability | email-compliance-checker, email-subject-checker | HIGH | Too verbose (350+ words) & too short subject |
| 6 | Department Alignment | campaign-target-checker | CRITICAL | Marketing vs Technology mismatch |
| 7 | Seniority Alignment | campaign-target-checker | CRITICAL | Mid-level vs C-Level mismatch |
| 8 | Company Verification | lead-data-consistency-verifier | HIGH | False parent company, headquarters mismatch |
| 9 | Job Title Verification | lead-data-consistency-verifier | CRITICAL | CTO vs Marketing Manager |
| 10 | Message Clarity & Tone | email-compliance-checker | HIGH | Uncertain, vague, unprofessional |

**Total Violations: 10+ critical and high-severity issues**

**Expected Outcome**: All QA agents should return FAIL or WARNING status with detailed explanations focusing on the previously untested validation dimensions.

---

## KEY DIFFERENCES FROM TEST CASES 1 & 2

**Test Case 1** focused on:
- Placeholders, spam triggers, false expertise, temporal issues, spelling errors

**Test Case 2** focused on:
- Broken URLs, controversial content, interaction history, subject-body misalignment

**Test Case 3** focuses on (PREVIOUSLY UNTESTED):
- ✅ Hidden Unicode characters (NEW)
- ✅ Spacing & formatting issues (NEW)
- ✅ Personalization quality failures (NEW)
- ✅ Logical flow & coherence problems (NEW)
- ✅ Overly verbose content (NEW)
- ✅ Subject line too short (NEW)
- ✅ Department alignment extreme mismatch (NEW ANGLE)
- ✅ Company verification with parent company confusion (NEW ANGLE)

Together, these three test cases now provide **COMPREHENSIVE COVERAGE** of all validation checks across all 6 QA agents, including edge cases and previously untested dimensions.
