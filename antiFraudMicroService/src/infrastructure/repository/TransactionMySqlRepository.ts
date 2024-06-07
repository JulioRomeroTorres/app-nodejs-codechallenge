import { Injectable } from "@nestjs/common";
import { ITransactionMySqlRepository } from "../../domain/repository/TransactionMySqlRepository"
import { CREATE_TRANSACTION, CREATE_TRANSACTION_TABLE, UPDATE_TRANSACTION_STATUS } from "./query/MySql";
import { DbTransactionInfo } from "@src/domain/interface/DbTransactionInfo";

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
      if(!this.isCreatedPool) this.createPoolConnection();
      
      const currentQuery = this.setParamsQuery({ 
        query: CREATE_TRANSACTION_TABLE
      }); 
      await this.poolConnection.query(currentQuery);
      await this.poolConnection.end();
      this.isCreatedTable = true;
    }catch(error){
      console.log('ErrorCreate', error);
      throw new Error();
    }
  }
  async createTransaction( args: DbTransactionInfo ): Promise<void>{
    try{
      if(!this.isCreatedPool) this.createPoolConnection();
      //if(!this.isCreatedTable) await this.createTable();
      
      const currentQuery = this.setParamsQuery({ 
        query: CREATE_TRANSACTION,
        params: args
      }); 
      await this.poolConnection.query(currentQuery);
      await this.poolConnection.end();
    }catch(error){
      console.log('errorcreate', error)
      throw new Error();
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
      if(!this.isCreatedPool) this.createPoolConnection();

      //if(!this.isCreatedTable) await this.createTable();
      
      const currentQuery = this.setParamsQuery({ 
        query: UPDATE_TRANSACTION_STATUS,
        params: args
      }); 
      await this.poolConnection.query(currentQuery);
      await this.poolConnection.end();
    }catch(error){
      throw new Error();
    }
  }
}