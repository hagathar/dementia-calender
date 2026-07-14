# Development Rules

## Image screen identification

Every image used for design, implementation, review, or annotation must be treated as containing at least one **screen**.

A **screen** is any area of an image that looks like the front face of a phone. In the current reference images, each screen's major colour is black, so black or mostly black phone-front-shaped areas should be treated as screen candidates.

When working from reference images:

- Identify every screen in the image before describing or implementing UI details.
- Treat any phone-front-shaped area as a screen, even when several appear in the same image.
- Do not ignore extra phone-front areas in multi-screen mockups; each one should be considered independently.
- Number multiple screens from left to right, unless the image has explicit labels that provide a different screen order.
- When discussing or implementing UI from a reference image, name the relevant screen first, then describe the elements inside it.
- If a user references an image and a screen number, use this screen-identification rule to locate the requested phone-front area before making code changes.
