export interface TokenIntrospectionResponse {
  active: boolean;
  client_id: string;
  scopes: string[];
  exp: number; // Expiration time
  // Add any other relevant fields as needed
}
