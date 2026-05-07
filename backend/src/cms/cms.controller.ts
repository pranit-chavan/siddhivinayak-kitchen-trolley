import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { CmsService } from './cms.service';

@ApiTags('cms')
@ApiBearerAuth()
@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Public()
  @Get('products')
  @ApiOperation({ summary: 'List all products' })
  getProducts() {
    return this.cmsService.getProducts();
  }

  @Public()
  @Post('products')
  @ApiOperation({ summary: 'Create a product' })
  createProduct(@Body() dto: any) {
    return this.cmsService.createProduct(dto);
  }

  @Public()
  @Patch('products/:id')
  @ApiOperation({ summary: 'Update a product' })
  updateProduct(@Param('id') id: string, @Body() dto: any) {
    return this.cmsService.updateProduct(id, dto);
  }

  @Public()
  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete a product' })
  deleteProduct(@Param('id') id: string) {
    return this.cmsService.deleteProduct(id);
  }

  @Public()
  @Get('portfolio')
  @ApiOperation({ summary: 'List all portfolio items' })
  getPortfolio() {
    return this.cmsService.getPortfolio();
  }

  @Public()
  @Post('portfolio')
  @ApiOperation({ summary: 'Create a portfolio item' })
  createPortfolio(@Body() dto: any) {
    return this.cmsService.createPortfolio(dto);
  }

  @Public()
  @Patch('portfolio/:id')
  @ApiOperation({ summary: 'Update a portfolio item' })
  updatePortfolio(@Param('id') id: string, @Body() dto: any) {
    return this.cmsService.updatePortfolio(id, dto);
  }

  @Public()
  @Delete('portfolio/:id')
  @ApiOperation({ summary: 'Delete a portfolio item' })
  deletePortfolio(@Param('id') id: string) {
    return this.cmsService.deletePortfolio(id);
  }
}
