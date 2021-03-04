import {OptionalAnswer} from '../components/poll/create-poll/create-poll.component';

export interface IQuestion {
  idQuestion: number;
  idRoom: number;
  type: number;
  content: string;
  optionalAnswers: OptionalAnswer[];
  displayedQuestion: boolean;
  displayedAnswers: boolean;
}

/*
type:
  open = 0
  choice = 1
  checkbox = 2
  slider = 3
}*/

