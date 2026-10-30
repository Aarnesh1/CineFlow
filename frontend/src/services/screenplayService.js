
import api from "./api";

export const getScenes = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/scenes`);
  return response.data;
};

export const createScene = async (projectId, scene) => {
  const response = await api.post(
    `/projects/${projectId}/scenes`,
    scene
  );
  return response.data;
};

export const updateScene = async (projectId, sceneId, scene) => {
  const response = await api.put(
    `/projects/${projectId}/scenes/${sceneId}`,
    scene
  );
  return response.data;
};

export const deleteScene = async (projectId, sceneId) => {
  await api.delete(`/projects/${projectId}/scenes/${sceneId}`);
};
