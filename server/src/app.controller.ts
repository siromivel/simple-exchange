import { Controller, Get, Res } from "@nestjs/common";
import * as path from "path";

@Controller()
export class AppController {
  @Get()
  root(@Res() res): void {
    res.sendFile(path.resolve("../browser/index.html"))
  }

  @Get("/dist/bundle.js")
  bundle(@Res() res): void {
    res.sendFile(path.resolve("../browser/dist/bundle.js"))
  }
}
