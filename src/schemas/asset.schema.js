import * as yup from 'yup'

  /**
   * Schema validation cho tài sản
   * @param {*} t - i18n
   * @returns {yup.ObjectSchema} - Schema validation cho tài sản
   */
export const assetSchema = (t) => {
  return yup.object({
    assetCode: yup
      .string()
      .required(t('asset.errors.assetCode_required'))
      .max(20, t('asset.errors.assetCode_max')),
    assetName: yup
      .string()
      .required(t('asset.errors.assetName_required'))
      .max(255, t('asset.errors.assetName_max')),
    departmentName: yup
      .object()
      .required(t('asset.errors.departmentName_required')),
    assetTypeName: yup
      .object()
      .required(t('asset.errors.assetTypeName_required')),
    quantity: yup
      .number()
      .required(t('asset.errors.quantity_required'))
      .typeError(t('asset.errors.number_invalid'))
      .positive(t('asset.errors.quantity_positive'))
      .min(1, t('asset.errors.quantity_positive')),
    price: yup
      .number()
      .required(t('asset.errors.price_required'))
      .typeError(t('asset.errors.number_invalid'))
      .positive(t('asset.errors.price_positive'))
      .min(1, t('asset.errors.price_positive')),
    depreciationRate: yup
      .number()
      .required(t('asset.errors.depreciationRate_required'))
      .typeError(t('asset.errors.number_invalid'))
      .positive(t('asset.errors.depreciationRate_positive'))
      .min(0.01, t('asset.errors.depreciationRate_positive')),
    purchaseDate: yup
      .date()
      .required(t('asset.errors.purchaseDate_required'))
      .typeError(t('asset.errors.date_invalid')),
    startDate: yup
      .date()
      .required(t('asset.errors.startDate_required'))
      .typeError(t('asset.errors.date_invalid')),
    useYears: yup
      .number()
      .required(t('asset.errors.useYears_required'))
      .typeError(t('asset.errors.number_invalid'))
      .positive(t('asset.errors.useYears_positive'))
      .min(1, t('asset.errors.useYears_positive')),
    annualDepreciation: yup
      .number()
      .optional()
  })
}
