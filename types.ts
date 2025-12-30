
export enum LineType {
  YANG = 'YANG',
  YIN = 'YIN'
}

export interface HexagramData {
  number: number;
  name: string;
  pinyin: string;
  symbol: string;
  lines: LineType[]; // Bottom to Top (1 to 6)
  judgment: string;  // 卦辞
  image: string;     // 象曰
  meaning: string;   // 现代解析
  lineTexts: string[]; // 爻辞 (Index 0 is Primary/Bottom line, Index 5 is Top line)
}

export interface DivinationResult {
  originalHex: HexagramData;
  changingLines: number[]; // 1-6
  changedHex?: HexagramData;
}
