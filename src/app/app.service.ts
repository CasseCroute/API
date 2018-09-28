import {Injectable, HttpServer} from '@nestjs/common';

@Injectable()
export class AppService {
    public root(): string {
        return 'Hello World!';
    }

}
