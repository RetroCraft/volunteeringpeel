import { includes, map, pull, sumBy } from 'lodash-es';
import * as moment from 'moment';
import * as React from 'react';
import { Button, Header, Icon, Item, Label, Progress, SemanticCOLORS } from 'semantic-ui-react';

import ConfirmModal from 'app/components/modules/ConfirmModal';
import Modal from 'app/components/modules/Modal';

interface EventModalProps {
  event: VPEvent;
}

interface EventModalState {
  selectedShifts: number[];
}

export default class EventModal extends React.Component<EventModalProps, EventModalState> {
  constructor() {
    super();

    this.state = {
      selectedShifts: [],
    };

    this.selectShift = this.selectShift.bind(this);
  }

  public render() {
    // Event is full if no shifts have spots
    const full =
      sumBy(this.props.event.shifts, 'max_spots') === sumBy(this.props.event.shifts, 'spots_taken');
    return (
      <Modal
        trigger={
          <Button animated disabled={full} floated="right" primary={!full}>
            <Button.Content visible>{full ? 'FULL :(' : 'Shifts'}</Button.Content>
            <Button.Content hidden>
              <Icon name="right arrow" />
            </Button.Content>
          </Button>
        }
        closeIcon
      >
        <Modal.Header>Signup - {this.props.event.name}</Modal.Header>
        <Modal.Content>
          <Item.Group>
            {map(this.props.event.shifts, (shift: Shift) => {
              // Calculate if event is full based on spots (sum up shift spots)
              const spotsLeft = shift.max_spots - shift.spots_taken;
              const shiftFull = spotsLeft === 0;
              // Calculate colour for progress bar.
              const colors: SemanticCOLORS[] = [
                'green',
                'green',
                'olive',
                'yellow',
                'orange',
                'red',
              ];
              const percentFull = shift.spots_taken / shift.max_spots;
              // Floor multiples of 20% so full is green, 99% - 80% is olive, etc.
              // Full bars are grey (disabled)
              const color = shiftFull ? 'grey' : colors[Math.floor(percentFull / 0.2)];
              // This right here is the world's biggest hack adding birthday to time so that
              // Javascript will accept it as a datetime
              const startTime = moment(`2017-03-16 ${shift.start_time}`).format('hh:mm A');
              const endTime = moment(`2017-03-16 ${shift.end_time}`).format('hh:mm A');
              // Has shift already been signed up for
              const selected = includes(this.state.selectedShifts, shift.shift_num);
              return (
                <Item key={shift.shift_id}>
                  <Item.Content>
                    <Item.Header>
                      Shift #{shift.shift_num}: {startTime} to {endTime}
                    </Item.Header>
                    <Item.Meta>{moment(shift.date).format('MMM D, YYYY')}</Item.Meta>
                    <Item.Description>
                      <p>{shift.notes}</p>
                      {map(shift.meals, meal => <Label key={meal}>{meal} provided</Label>)}
                    </Item.Description>
                    <Item.Extra>
                      <Progress
                        value={shift.spots_taken}
                        total={shift.max_spots}
                        label="Spots"
                        size="small"
                        color={color}
                      />
                      <ConfirmModal
                        full={shiftFull}
                        selected={selected}
                        content="Are you sure you want to sign up for this shift?"
                        header={`Sign Up for ${this.props.event.name} shift #${shift.shift_num}`}
                        yes={() => this.selectShift(shift.shift_num)}
                      />
                    </Item.Extra>
                  </Item.Content>
                </Item>
              );
            })}
          </Item.Group>
        </Modal.Content>
      </Modal>
    );
  }

  private selectShift(shiftNum: number) {
    if (includes(this.state.selectedShifts, shiftNum)) {
      this.setState({ selectedShifts: pull(this.state.selectedShifts, shiftNum) });
    } else {
      this.setState({ selectedShifts: this.state.selectedShifts.concat(shiftNum) });
    }
  }
}
