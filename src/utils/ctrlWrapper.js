export const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    console.log('123', req);

    try {
      await controller(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
