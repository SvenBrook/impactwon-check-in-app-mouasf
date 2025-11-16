
import { captureRef } from 'react-native-view-shot';
import { RefObject } from 'react';

export async function captureChartAsBase64(
  chartRef: RefObject<any>
): Promise<string | null> {
  try {
    if (!chartRef.current) {
      console.log('Chart ref is not available');
      return null;
    }

    const uri = await captureRef(chartRef, {
      format: 'png',
      quality: 1,
      result: 'base64',
    });

    return uri;
  } catch (error) {
    console.error('Error capturing chart:', error);
    return null;
  }
}
