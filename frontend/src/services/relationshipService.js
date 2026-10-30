
import api from "./api";

const relationshipBase = (projectId) =>
  `/projects/${projectId}/relationships`;

export const getRelationships = async (projectId) => {
  const response = await api.get(relationshipBase(projectId));
  return response.data;
};

export const createRelationship = async (projectId, data) => {
  const response = await api.post(relationshipBase(projectId), data);
  return response.data;
};

export const updateRelationship = async (projectId, relationshipId, data) => {
  const response = await api.put(
    `${relationshipBase(projectId)}/${relationshipId}`,
    data
  );
  return response.data;
};

export const deleteRelationship = async (projectId, relationshipId) => {
  const response = await api.delete(
    `${relationshipBase(projectId)}/${relationshipId}`
  );
  return response.data;
};
