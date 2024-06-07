import { Injectable } from "@nestjs/common";
import { ITransactionMySqlRepository } from "../../domain/repository/TransactionMySqlRepository"
import { CREATE_TRANSACTION, CREATE_TRANSACTION_TABLE, UPDATE_TRANSACTION_STATUS } from "./query/MySql";
import { DbTransactionInfo } from "@src/domain/interface/DbTransactionInfo";
import { CustomException } from "@src/application/exception/Exception";
import { HTTP_STATUS } from "@src/application/constants/Constants";

const mysql = require('mysql2/promise');

@Injectable()
export class TransactionMySqlRepository implements ITransactionMySqlRepository {
  isCreatedTable: boolean
  isCreatedPool: boolean
  poolConnection: any
  constructor(){
    this.isCreatedTable = false;
    this.isCreatedPool = false;
  }
  createPoolConnection(): void {
    this.poolConnection = mysql.createPool({
      connectionLimit: 10,
      host:  process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });
    this.isCreatedPool = true;
  }
  setParamsQuery( args: { query: string, params?: Record<string, any>} ): string {
    let { query, params } = args;
    
    if(!params) return query;

    const listKeys = Object.keys(params);
    
    listKeys.forEach( (key) => {
      let replacedValue = params[key];
      if( typeof params[key] === 'string' ) replacedValue = `"${params[key]}"`;
      query = query.replace( `:${key}`, replacedValue);
    });
    return query;
  }
  async createTable(): Promise<void>{
    try{
      this.createPoolConnection();
      
      const currentQuery = this.setParamsQuery({ 
        query: CREATE_TRANSACTION_TABLE
      }); 
      await this.poolConnection.query(currentQuery);
      await this.poolConnection.end();
      this.isCreatedTable = true;
    }catch(error){
      console.log('ErrorCreateTable', error);
      throw new CustomException({
        message: String(error),
        httpStatus: HTTP_STATUS.INTERNAL_SERVER_ERROR
      });
    }
  }
  async createTransaction( args: DbTransactionInfo ): Promise<void>{
    try{
      this.createPoolConnection();
      //if(!this.isCreatedTable) await this.createTable();
      
      const currentQuery = this.setParamsQuery({ 
        query: CREATE_TRANSACTION,
        params: args
      }); 
      await this.poolConnection.query(currentQuery);
      await this.poolConnection.end();
    }catch(error){
      console.log('errorCreateTransaction', error);
      throw new CustomException({
        message: String(error),
        httpStatus: HTTP_STATUS.INTERNAL_SERVER_ERROR
      });
    }
  }
  async updateStatusTransaction( 
    args: { 
      statusTransaction: boolean,
      accountDebitId: string,
      accountCreditId: string
    }
  ): Promise<void>{
    try{
      this.createPoolConnection();

      //if(!this.isCreatedTable) await this.createTable();
      
      const currentQuery = this.setParamsQuery({ 
        query: UPDATE_TRANSACTION_STATUS,
        params: args
      }); 
      await this.poolConnection.query(currentQuery);
      await this.poolConnection.end();
    }catch(error){
      console.log('ErrorUpdateTransaction', error);
      throw new CustomException({
        message: String(error),
        httpStatus: HTTP_STATUS.INTERNAL_SERVER_ERROR
      });
    }
  }
}