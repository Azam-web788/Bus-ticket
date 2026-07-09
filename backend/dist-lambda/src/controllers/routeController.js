import {
  putItem,
  getItem,
  updateItem,
  deleteItem,
  scanTable,
  generateId,
  Keys,
} from '../config/dynamoClient.js';

export const getRoutes = async (req, res, next) => {
  try {
    const routes = await scanTable({
      filterExpression: '#type = :type',
      expressionAttributeNames: { '#type': 'type' },
      expressionAttributeValues: { ':type': 'route' },
    });

    routes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({
      routes: routes.map((r) => ({
        id: r.id,
        from_city: r.from_city,
        to_city: r.to_city,
        distance: r.distance,
        duration: r.duration,
        base_price: r.base_price,
        status: r.status,
        created_at: r.created_at,
      })),
    });
  } catch (err) {
    next(err);
  }
};

export const getRouteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const key = Keys.route(id);
    const route = await getItem(key.PK, key.SK);

    if (!route) {
      return res.status(404).json({ error: 'Route not found.' });
    }

    res.json({
      route: {
        id: route.id,
        from_city: route.from_city,
        to_city: route.to_city,
        distance: route.distance,
        duration: route.duration,
        base_price: route.base_price,
        status: route.status,
        created_at: route.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createRoute = async (req, res, next) => {
  try {
    const { fromCity, toCity, distance, duration, basePrice, status } = req.body;

    if (!fromCity || !toCity || !duration || !basePrice) {
      return res.status(400).json({ error: 'From city, to city, duration, and base price are required.' });
    }

    const id = generateId();
    const now = new Date().toISOString();

    const route = {
      ...Keys.route(id),
      type: 'route',
      id,
      from_city: fromCity,
      to_city: toCity,
      distance: distance || null,
      duration,
      base_price: parseFloat(basePrice),
      status: status || 'active',
      created_at: now,
      updated_at: now,
    };

    await putItem(route);

    res.status(201).json({
      route: {
        id: route.id,
        from_city: route.from_city,
        to_city: route.to_city,
        distance: route.distance,
        duration: route.duration,
        base_price: route.base_price,
        status: route.status,
        created_at: route.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fromCity, toCity, distance, duration, basePrice, status } = req.body;
    const key = Keys.route(id);
    const now = new Date().toISOString();

    const updates = { updated_at: now };
    if (fromCity) updates.from_city = fromCity;
    if (toCity) updates.to_city = toCity;
    if (distance !== undefined) updates.distance = distance;
    if (duration) updates.duration = duration;
    if (basePrice) updates.base_price = parseFloat(basePrice);
    if (status) updates.status = status;

    const updated = await updateItem(key.PK, key.SK, updates);

    if (!updated) {
      return res.status(404).json({ error: 'Route not found.' });
    }

    res.json({
      route: {
        id: updated.id,
        from_city: updated.from_city,
        to_city: updated.to_city,
        distance: updated.distance,
        duration: updated.duration,
        base_price: updated.base_price,
        status: updated.status,
        created_at: updated.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const key = Keys.route(id);
    const route = await getItem(key.PK, key.SK);

    if (!route) {
      return res.status(404).json({ error: 'Route not found.' });
    }

    await deleteItem(key.PK, key.SK);
    res.json({ message: 'Route deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
