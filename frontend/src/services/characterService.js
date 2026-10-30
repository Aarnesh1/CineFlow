
import api from "./api";

export const getCharacters = async (projectId) => {
  const response = await api.get(
    `/projects/${projectId}/characters`
  );
  return response.data;
};

export const createCharacter = async (projectId, character) => {
  const response = await api.post(
    `/projects/${projectId}/characters`,
    character
  );
  return response.data;
};

export const updateCharacter = async (
  projectId,
  characterId,
  character
) => {
  const response = await api.put(
    `/projects/${projectId}/characters/${characterId}`,
    character
  );
  return response.data;
};

export const deleteCharacter = async (projectId, characterId) => {
  await api.delete(
    `/projects/${projectId}/characters/${characterId}`
  );
};
