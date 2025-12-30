chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
  if (req.type === 'GET_PROFILE') {
    // Try multiple selectors for job title
    const role =
      (document.querySelector('.top-card-layout__title') as HTMLElement)?.innerText ||
      (document.querySelector('.job-details-jobs-unified-top-card__job-title') as HTMLElement)
        ?.innerText ||
      (document.querySelector('h1.t-24') as HTMLElement)?.innerText ||
      (document.querySelector('h2.t-24') as HTMLElement)?.innerText ||
      '';

    // Try multiple selectors for company name
    const company =
      (document.querySelector('.top-card-layout__company') as HTMLElement)?.innerText ||
      (document.querySelector('.job-details-jobs-unified-top-card__company-name') as HTMLElement)
        ?.innerText ||
      (document.querySelector('a.topcard__org-name-link') as HTMLElement)?.innerText ||
      (document.querySelector('.topcard__flavor--black-link') as HTMLElement)?.innerText ||
      '';

    // Extract skills from the job description
    const skills: string[] = [];

    // Try to find skills section
    const skillsSection =
      document.querySelector('.job-details-how-you-match__skills-item-subtitle') ||
      document.querySelector('.job-details-skill-match-status-list');

    if (skillsSection) {
      const skillElements = skillsSection.querySelectorAll('span, li');
      skillElements.forEach((el) => {
        const text = (el as HTMLElement).innerText.trim();
        if (text && text.length > 2 && text.length < 50) {
          skills.push(text);
        }
      });
    }

    // Fallback: scan for common skill patterns in job description
    if (skills.length === 0) {
      const descriptionElement =
        document.querySelector('.jobs-description') ||
        document.querySelector('.job-details-jobs-unified-top-card__job-insight');

      if (descriptionElement) {
        const description = (descriptionElement as HTMLElement).innerText;
        // Common tech skills patterns
        const skillPatterns = [
          /\b(JavaScript|TypeScript|Python|Java|React|Node\.js|SQL|AWS|Docker|Kubernetes|Git)\b/gi,
          /\b(C\+\+|Ruby|Go|Rust|Swift|Kotlin|PHP|Angular|Vue\.js|MongoDB|PostgreSQL)\b/gi,
        ];

        skillPatterns.forEach((pattern) => {
          const matches = new RegExp(pattern).exec(description);
          if (matches) {
            matches.forEach((match) => {
              if (!skills.includes(match)) {
                skills.push(match);
              }
            });
          }
        });
      }
    }

    sendResponse({
      fullName: '', // Not needed for job postings
      role: role.trim(),
      company: company.trim(),
      skills: skills.slice(0, 10), // Limit to 10 skills
      url: globalThis.location.href,
    });
  }

  return true; // Keep the message channel open for async response
});
