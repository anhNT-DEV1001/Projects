import { IsNumber, IsOptional, IsString } from "class-validator";

export class MasterDataDto {

  @IsOptional()
  @IsNumber()
  id?: number

  @IsString()
  @IsOptional()
  dataKey?: string

  @IsString()
  @IsOptional()
  dataValue?: string

  @IsString()
  @IsOptional()
  dataType?: string

  @IsString()
  @IsOptional()
  dataTypeName?: string

  @IsString()
  @IsOptional()
  dataValueName?: string

  @IsString()
  @IsOptional()
  dataDescription?: string

  @IsNumber()
  @IsOptional()
  dataOrder?: number
}