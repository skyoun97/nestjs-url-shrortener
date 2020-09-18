export interface GetUrlStatDTO {
  url: string;
  accessKey: string;
  createDate: string;
  accessCounts: { Date: string; count: number }[];
  accessTotalCount: number;
}
