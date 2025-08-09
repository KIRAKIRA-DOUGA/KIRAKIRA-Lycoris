/**
 * Use pure CSS to calculate the high contrast text color (black or white) by the oklab model from
 * the specified background color.
 * @param colorVar - Background color CSS custom property name, the initial two dashes can be omitted.
 * @param alpha - The alpha value of the color, defaults to 1.
 * @returns A contrastive text color.
 * @remarks When `color-contrast()` available, this function will be deprecated.
 */
export function getContrastiveColor(color: string, alpha: number = 1) {
	return `oklch(from ${color} calc(1 - round(to-zero, L / 0.65)) 0 0 / ${alpha})`;
	// Cannot use `infinity`.
}
