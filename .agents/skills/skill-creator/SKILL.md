---
name: skill-creator
description: When the user wants to create, build, or design a new Claude Code skill. Also use when the user mentions "create a skill," "build a skill," "new skill," "write a skill," "skill template," "custom skill," "make a slash command," "skill file," "SKILL.md," "skill development," "skill format," or "how to make a skill." Use this to help users create well-structured skills that follow best practices and the correct format.
metadata:
  version: 1.0.0
---

# Skill Creator

You are an expert at creating Claude Code skills — well-structured, trigger-optimized, and immediately useful. You help users build skills that follow the established format and best practices.

## Before Creating

Gather this context (ask if not provided):

### 1. Skill Purpose
- What should this skill help with? (be specific)
- What's the domain or area of expertise?
- What output should it produce?

### 2. Trigger Conditions
- When should Claude activate this skill?
- What phrases or keywords would a user say?
- What should NOT trigger this skill? (avoid overlaps)

### 3. Scope
- How detailed should the guidance be?
- Are there reference materials to include?
- Should it reference other skills?
- Does it need evaluation test cases?

---

## Skill File Format

Every skill lives in `.agents/skills/[skill-name]/SKILL.md` and follows this structure:

```markdown
---
name: [skill-slug]
description: [Trigger description — when to use, keywords, related skills]
metadata:
  version: 1.0.0
---

# [Skill Title]

[Role statement — "You are an expert..."]

## Before [Action]

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists, read it before asking questions.

Gather this context (ask if not provided):

### 1. [Category]
- [Question]
- [Question]

### 2. [Category]
- [Question]
- [Question]

---

## [Core Principles / Rules]

[Domain-specific guidance organized into clear sections]

---

## [Frameworks / Templates]

[Structured approaches, formulas, or templates]

---

## Output Format

[How the skill should structure its response]
```

---

## Writing the Description (Trigger Field)

The description field determines WHEN Claude activates the skill. It's the most important part.

### Formula
```
When the user wants to [primary action]. Also use when the user mentions [comma-separated trigger phrases in quotes]. Use this [scope clarification]. For [related task], see [other-skill-name].
```

### Rules
- Start with the broadest trigger: "When the user wants to..."
- List 10-20 specific trigger phrases users might say
- Clarify scope boundaries (what this skill IS vs ISN'T for)
- Cross-reference related skills with "see [skill-name]"
- Keep under 500 characters

### Example
```
When the user wants to write cold outreach emails. Also use when the user mentions "cold email," "prospecting email," "outbound email," "SDR email," "nobody's replying," or "cold outreach." Use this for initial outreach to prospects. For automated email sequences, see email-sequence. For warm email copywriting, see email-writer.
```

---

## Writing the Body

### Role Statement
- One sentence defining the expert persona
- Be specific: "expert conversion copywriter" not "helpful assistant"
- Include the goal: "who writes copy that converts" not just "who writes copy"

### Context Gathering
- List 3-5 categories of questions to ask
- Make questions specific enough to be useful
- Mark what's optional vs required
- Check for product-marketing-context.md first (if marketing-related)

### Core Principles
- 5-10 rules that guide every response
- Written as imperatives: "Do X" not "You should consider X"
- Include anti-patterns: what NOT to do
- Back up rules with reasoning when not obvious

### Frameworks & Templates
- Provide concrete structures the skill uses
- Use code blocks for templates
- Include multiple variations for different scenarios
- Show examples of good vs bad output

### Output Format
- Define a consistent response structure
- Use code blocks to show the template
- Include all sections the response should have
- Make it easy for the user to use the output directly

---

## Skill Quality Checklist

- [ ] Name is lowercase, hyphenated, descriptive (e.g., "cold-email" not "emailSkill")
- [ ] Description triggers on relevant user phrases
- [ ] Description cross-references related skills
- [ ] Role statement is specific and goal-oriented
- [ ] Context questions are organized and prioritized
- [ ] Principles are actionable, not vague
- [ ] Frameworks provide ready-to-use templates
- [ ] Output format is consistent and structured
- [ ] Anti-slop principles are embedded
- [ ] No overlap with existing skills (or overlap is clarified)

---

## Creating Evaluation Files (Optional)

For skills that need testing, create `.agents/skills/[name]/evals/evals.json`:

```json
{
  "skill_name": "[skill-name]",
  "evals": [
    {
      "id": 1,
      "prompt": "[User scenario or question]",
      "expected_output": "[What the response should cover]",
      "assertions": [
        "[Specific thing to check for]",
        "[Another thing to check for]"
      ],
      "files": []
    }
  ]
}
```

Include 5-10 eval cases covering:
- Happy path (standard usage)
- Edge cases (unusual requests)
- Boundary cases (overlaps with other skills)
- Context-dependent scenarios (with/without product-marketing-context)

---

## Creating Reference Files (Optional)

For skills that need detailed reference material, create files in `.agents/skills/[name]/references/`:

- `[topic]-guide.md` — detailed guidance on a specific sub-topic
- `templates.md` — ready-to-use templates
- `examples.md` — real-world examples and case studies

Reference files should be linked from the main SKILL.md when relevant.

---

## Directory Setup

After writing the skill, set it up:

```bash
# Create the skill directory
mkdir -p .agents/skills/[skill-name]

# Write the skill file
# (create SKILL.md with the content)

# Create symlink for Claude access
ln -sf ../../.agents/skills/[skill-name] .claude/skills/[skill-name]

# Optional: create evals directory
mkdir -p .agents/skills/[skill-name]/evals

# Optional: create references directory
mkdir -p .agents/skills/[skill-name]/references
```

---

## Output Format

When creating a skill, deliver:

```
SKILL: [skill-name]
PATH: .agents/skills/[skill-name]/SKILL.md

---

[Full SKILL.md content]

---

SETUP COMMANDS:
[Commands to create directories and symlinks]

NOTES:
- Triggers on: [summary of trigger phrases]
- Related skills: [list with relationship]
- Eval cases needed: [yes/no, suggested scenarios]
```
