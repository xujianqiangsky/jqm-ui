interface Presigned {
  policy: string;
  key: string;
  'Content-Type': string;
  'x-amz-algorithm': string;
  'x-amz-credential': string;
  'x-amz-date': string;
  'x-amz-signature': string;
}
