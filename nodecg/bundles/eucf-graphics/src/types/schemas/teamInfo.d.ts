/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface TeamInfo {
  teamName: string;
  numOfPlayers?: number;
  /**
   * Players on this team
   */
  players: PlayerInfo[];
}
export interface PlayerInfo {
  username: string;
  role?: string;
  /**
   * Age in years
   */
  age?: number;
  major?: string;
}
