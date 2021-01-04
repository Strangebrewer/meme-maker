import { fabric } from 'fabric';
import { beforeAdding, afterAdding } from '../helper';
import API from '../../../../api';

export async function stockWidget(getFabric, pushVersion) {
    beforeAdding(getFabric);

    const stockData = await API.widget.getStock('AAPL');
    console.log('stockData:::', stockData);
}