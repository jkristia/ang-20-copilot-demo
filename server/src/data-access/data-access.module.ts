import { Global, Module } from '@nestjs/common';
import { DataAccessService } from './data-access.service';

@Global()
@Module({
  providers: [DataAccessService],
  exports: [DataAccessService],
})
export class DataAccessModule {}
