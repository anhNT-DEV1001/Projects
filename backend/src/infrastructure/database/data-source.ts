import 'dotenv/config';

import { DataSource, DataSourceOptions } from 'typeorm';

const databasePort = Number.parseInt(process.env.DB_PORT ?? '5432', 10);

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',

  host: process.env.DB_HOST ?? '127.0.0.1',
  port: databasePort,
  username: process.env.DB_USERNAME ?? process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'nestjs_db',
  schema: process.env.DB_SCHEMA ?? 'public',

  /*
   * Lấy tất cả entity trong thư mục src khi chạy TypeScript,
   * hoặc dist khi đã build sang JavaScript.
   */
  entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],

  migrations: [`${__dirname}/migrations/*{.ts,.js}`],

  subscribers: [`${__dirname}/subscribers/*{.ts,.js}`],

  /*
   * Tên bảng lưu lịch sử migration đã chạy.
   */
  migrationsTableName: 'typeorm_migrations',

  /*
   * Không tự chạy migration khi khởi tạo DataSource.
   * Migration sẽ được điều khiển bằng CLI.
   */
  migrationsRun: false,

  /*
   * Bắt buộc tắt khi quản lý schema bằng migration.
   */
  synchronize: false,

  /*
   * Chạy toàn bộ migration pending trong một transaction.
   */
  migrationsTransactionMode: 'all',

  logging: process.env.DB_LOGGING === 'true',
};

export default new DataSource(dataSourceOptions);
