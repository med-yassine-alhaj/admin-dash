export type Agent = {
  nom: string;
  prenom: string;
  numeroCIN: string;
  email: string;
  telephone: string;
  motDePasse: string;
};

export type AgentDocument = Agent & { id: string };
