export class PayloadDto {
  sub!: number;
  username!: string;
  sessionId!: string;
  type!: 'access' | 'refresh';
  exp?: number;
}
