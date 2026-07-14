import { IsNumber, IsOptional, IsString } from "class-validator";

export class MasterDataQueryDto {

  @IsOptional()
  @IsString()
  dataKey?: string;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  page?: number;
}