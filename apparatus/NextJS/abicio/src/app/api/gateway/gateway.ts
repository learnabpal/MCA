import { ApiStatus } from "@/firebase/Bridge";
import { EnquiryData } from "@/firebase/RtdbFunctions";




export type GatewayQuery = EnquiryData


const query = "query";


export const GATEWAY_SECTIONS = [ query ] as const;
export type GatewaySectionKey = typeof GATEWAY_SECTIONS[number]
export type GatewayPayload = GatewayQuery;
export type GatewayEntry<T = GatewayPayload> = T;

// Inbox is a sharded collection now
export type GatewayInbox = {
	  [query]: { [id: string]: GatewayEntry<GatewayQuery> };
};

export type ApiGatewayTaketh = { token: string, category: GatewaySectionKey, payload: GatewayPayload };
export type ApiGatewayGiveth = {} & ApiStatus
