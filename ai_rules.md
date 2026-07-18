# AI Assistant Rules for Tomomarro Project

**CRITICAL DIRECTIVE: The AI must read and strictly adhere to these rules before starting any task in this workspace.**

## 1. No Unverified Assumptions
- **Do not assume codebase behavior, structure, or dependencies.** Always use search and view tools to verify your assumptions in the actual code before proposing changes.
- **Verify before planning:** Understand the full context and impact of what you are about to change.

## 2. Strict Planning & Approval Process (Mandatory)
- **Never write or modify code without an implementation plan.**
- **Always create a detailed implementation plan** before making any code changes. The plan must explicitly state:
  - What exactly is going to be changed.
  - The proposed solution and reasoning.
  - The exact files that will be modified.
  - The specific parts of the code to be added, removed, or updated.
- **Always ask for explicit user permission** before executing the plan.
- **Do not implement ANY changes without the user giving clear permission.**

## 3. Strict Execution Boundaries
- **Only implement what is explicitly in the approved plan.**
- **Never touch any file outside of the plan.** No unrequested "bonus" fixes or hidden changes.
- **Zero collateral damage:** Before changing or removing code, thoroughly check if it will affect or break other systems or parts of the application. If there is a risk, stop, evaluate alternative approaches, and discuss with the user.

## 4. Architecture & Code Quality
- **Separation of Concerns:** Do not mix UI code and Business Logic. Keep the codebase clean, modular, and well-architected.
- **System Design:** Act as an expert system designer and developer. Choose robust, scalable, and maintainable solutions over quick hacks.
- **Performance & Smoothness:** Always prioritize application performance. Ensure the UI remains perfectly smooth (avoiding unnecessary rebuilds and expensive synchronous operations).

## 5. Post-Implementation Verification
- **Validate your work:** After completing the code changes, always verify that the application logic remains intact.
- **Run Diagnostics:** Actively check for errors. Run `flutter analyze` or check your diagnostic tools to ensure no syntax errors, lint warnings, or broken dependencies were introduced.
