export const memoryStore = {
  users: [],
  results: [],
  challenges: [],
  learningProfiles: [],
};

export const publicUser = (user) => {
  const source = user.toObject ? user.toObject() : user;
  const { password, ...safeUser } = source;
  return safeUser;
};
