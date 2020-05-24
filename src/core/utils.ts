class Utils {
    public static random(min: number = 0, max: number = 1): number {
        if (min > max) {
            [min, max] = [0, min];
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    }
}