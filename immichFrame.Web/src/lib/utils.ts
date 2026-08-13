import { isImageAsset } from '$lib/constants/asset-type';
import type { AssetResponseDto } from '$lib/immichFrameApi';

export const decodeBase64 = (data: string) => Uint8Array.from(atob(data), (c) => c.charCodeAt(0));

export const handlePromiseError = <T>(promise: Promise<T>): void => {
	promise.catch((error) => console.error(`[utils.ts]:handlePromiseError ${error}`, error));
};

const ROTATED_ORIENTATIONS = new Set([5, 6, 7, 8]);

function getPositiveDimension(value?: number | null) {
	return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null;
}

function getAssetDimensions(asset: AssetResponseDto) {
	let width =
		getPositiveDimension(asset.exifInfo?.exifImageWidth) ?? getPositiveDimension(asset.width);
	let height =
		getPositiveDimension(asset.exifInfo?.exifImageHeight) ?? getPositiveDimension(asset.height);

	if (!width || !height) {
		return null;
	}

	if (ROTATED_ORIENTATIONS.has(Number(asset.exifInfo?.orientation ?? 0))) {
		[width, height] = [height, width];
	}

	return { width, height };
}

export function isPortraitAsset(asset: AssetResponseDto) {
	if (!isImageAsset(asset)) {
		return false;
	}

	const dimensions = getAssetDimensions(asset);
	return dimensions ? dimensions.height > dimensions.width : false;
}

export function isLandscapeAsset(asset: AssetResponseDto) {
	if (!isImageAsset(asset)) {
		return false;
	}

	const dimensions = getAssetDimensions(asset);
	return dimensions ? dimensions.width > dimensions.height : false;
}
