import { getObstacles, HIT_HALF_H, HIT_HALF_W } from "./obstacles.js";

let elevatedObstacle = null;

export function isElevated() {
    return elevatedObstacle !== null;
}

export function canClimbFrom(x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return false;

    return getObstacles().some((obstacle) =>
        obstacle.escalavel &&
        x + HIT_HALF_W > obstacle.x - 3 &&
        x - HIT_HALF_W < obstacle.x + obstacle.w + 3 &&
        y + HIT_HALF_H > obstacle.y - 3 &&
        y - HIT_HALF_H < obstacle.y + obstacle.h + 3
    );
}

export function toggleClimbAt(x, y) {
    if (elevatedObstacle) {
        const obstacle = elevatedObstacle;
        elevatedObstacle = null;
        return {
            x,
            y: obstacle.y + obstacle.h + HIT_HALF_H,
            elevated: false
        };
    }

    const obstacle = getObstacles().find((item) =>
        item.escalavel &&
        x + HIT_HALF_W > item.x - 3 &&
        x - HIT_HALF_W < item.x + item.w + 3 &&
        y + HIT_HALF_H > item.y - 3 &&
        y - HIT_HALF_H < item.y + item.h + 3
    );
    if (!obstacle) return null;

    elevatedObstacle = obstacle;
    return {
        x: Math.max(obstacle.x + HIT_HALF_W, Math.min(obstacle.x + obstacle.w - HIT_HALF_W, x)),
        y: obstacle.y - HIT_HALF_H,
        elevated: true
    };
}

export function getClimbBounds() {
    if (!elevatedObstacle) return null;

    return {
        minX: elevatedObstacle.x + HIT_HALF_W,
        maxX: elevatedObstacle.x + elevatedObstacle.w - HIT_HALF_W,
        minY: elevatedObstacle.y - HIT_HALF_H,
        maxY: elevatedObstacle.y - HIT_HALF_H
    };
}

export function resetClimb() {
    elevatedObstacle = null;
}
