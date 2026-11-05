---
title: "Dice Battle (in Python)"
date: 2026-09-20
emoji: "🎲"
summary: "My first real program: you and the computer roll dice and best of 5 wins."
status: "works"
tech: ["Python"]
repo: "https://github.com/progscratchm"
---

My first program that other people actually played.

## The idea

You roll a dice. The computer rolls a dice. Highest number wins the round.
First to 3 rounds wins the game.

## The code bit I'm proud of

I learned about `random` and about `while` loops — the loop keeps the game
going until somebody wins, so I don't have to copy-paste the same code 5 times.

```python
import random

while me < 3 and robot < 3:
    print("Rolling!")
```

## What's next

I want to add a **dragon** that cheats sometimes.
