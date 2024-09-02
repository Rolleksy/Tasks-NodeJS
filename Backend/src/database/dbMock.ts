import {IDatabase} from './Idatabase';
import { RunResult } from 'sqlite3';

const dbMock: jest.Mocked<IDatabase> = {
    run: jest.fn().mockResolvedValue({} as RunResult),
    all: jest.fn().mockResolvedValue([]),
    get: jest.fn().mockResolvedValue(null),
    exec: jest.fn().mockResolvedValue(undefined),
    prepare: jest.fn().mockReturnValue({}),
};

export default dbMock;