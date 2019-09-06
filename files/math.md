
## Vector to 8-Directions


enum xDir { West = -1, Center = 0, East = 1 }
enum yDir { South = -1, Center = 0, North = 1 }

xDir GetXdirection(Vector2 heading)
{
    return round(heading.x / Max(heading.x, heading.y));
}

yDir GetYdirection(Vector2 heading)
{
    return round(heading.y / Max(heading.x, heading.y));
}
