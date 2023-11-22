import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

export const validateForm = (req, res) => {
  const result = validationResult(req).formatWith((row, param, value) => ({
    field: row.path,
    message: row.msg
  }));

  if (!result.isEmpty()) {
    res.status(422).json({
      status: 'fail',
      message: 'Validation Errors',
      errors: result.array(),
    });

    return false;
  }

  return true;
};

export const filterRequest = (
  requestBody,
  isInclude = true,
  properties = []
) => {
  requestBody = { ...requestBody };

  const allowedRequests = [];

  // Remap allowed properties
  for (const property of properties) {
    if (Array.isArray(property)) {
      allowedRequests.push(property[0]);
    } else if (typeof property == 'string') {
      allowedRequests.push(property);
    }
  }

  // Cleaning unwanted properties
  for (const key in requestBody) {
    if (
      isInclude ? !allowedRequests.includes(key) : allowedRequests.includes(key)
    )
      delete requestBody[key];
  }

  // Remap property name (for array only fields)
  for (const property of properties) {
    if (Array.isArray(property)) {
      requestBody[property[1]] = requestBody[property[0]];
      delete requestBody[property[0]];
    }
  }

  return requestBody;
};

const getPagination = (page, size)  => {
    const limit = size ? +size : 10
    const offset = page ? page * limit : 0

    return { limit, offset }
}

const parsePaginateFilters = (model, filters) => {
  const filter = { [Op.or]: [] };
  for (const f of filters) {
    if (f.field != 'undefined' && f.field.indexOf('.') == -1 && f.field[0].toUpperCase() != f.field[0]) {
      filter[Op.or].push(
        Sequelize.where(Sequelize.cast(Sequelize.col(`${model.name}.${f.field}`), 'varchar'
      ), {
        [Op.iLike]: `%${f.value}%`,
      }));
    }
  }
  return filter;
}

const parsePaginateSorters = sorters => sorters.map(
  sort => sort.field.indexOf('.') >= 0 ? [sort.field.split('.')[0], sort.field.split('.')[1], sort.dir.toUpperCase()] : [sort.field, sort.dir.toUpperCase()]
);

const paginateQuery = (model, req, query = {}) => {
  const q = { ...query }
  const { sorters, filters } = req.query

  if(sorters && sorters.length) q.order = q.order ? [...parsePaginateSorters(sorters), ...q.order] : [...parsePaginateSorters(sorters)]
  if(filters && filters.length) q.where = q.where ? {...parsePaginateFilters(model, filters), ...q.where} : {...parsePaginateFilters(model, filters)}

  return q
}

const getPaginateData = (data, page, limit) => {
  const { count: resultTotal, rows: items } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(resultTotal / limit)

  return { items, resultTotal, totalPages, currentPage }
}

export const paginateData = async (req, model, query = {}) => {
    const { page, size } = req.query

    const { limit, offset } = getPagination(page, size)

    const result = await model.findAndCountAll(paginateQuery(model, req, {
      ...query,
      limit,
      offset
    }))

    return getPaginateData(result, page, limit)
}
