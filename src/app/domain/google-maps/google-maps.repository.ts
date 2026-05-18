import { Observable } from 'rxjs';
import { GetPlacePredictionsDTO } from './dto/get-place-predictions.dto';

export abstract class IGoogleMapsRepository {
  abstract getPlacePredictions(props: GetPlacePredictionsDTO): Observable<string[]>;
}
