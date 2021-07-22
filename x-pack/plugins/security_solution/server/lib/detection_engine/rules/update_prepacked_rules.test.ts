/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { savedObjectsClientMock } from '../../../../../../../src/core/server/mocks';
import { rulesClientMock } from '../../../../../alerting/server/mocks';
import { getFindResultWithSingleHit } from '../routes/__mocks__/request_responses';
import { updatePrepackagedRules } from './update_prepacked_rules';
import { patchRules } from './patch_rules';
import { getAddPrepackagedRulesSchemaDecodedMock } from '../../../../common/detection_engine/schemas/request/add_prepackaged_rules_schema.mock';
jest.mock('./patch_rules');

describe('updatePrepackagedRules', () => {
  let rulesClient: ReturnType<typeof rulesClientMock.create>;
  let savedObjectsClient: ReturnType<typeof savedObjectsClientMock.create>;

  beforeEach(() => {
    rulesClient = rulesClientMock.create();
    savedObjectsClient = savedObjectsClientMock.create();
  });

  it('should omit actions and enabled when calling patchRules', async () => {
    const actions = [
      {
        group: 'group',
        id: 'id',
        action_type_id: 'action_type_id',
        params: {},
      },
    ];
    const outputIndex = 'outputIndex';
    const prepackagedRule = getAddPrepackagedRulesSchemaDecodedMock();
    rulesClient.find.mockResolvedValue(getFindResultWithSingleHit());

    await updatePrepackagedRules(
      rulesClient,
      savedObjectsClient,
      [{ ...prepackagedRule, actions }],
      outputIndex
    );

    expect(patchRules).toHaveBeenCalledWith(
      expect.objectContaining({
        actions: undefined,
      })
    );

    expect(patchRules).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: undefined,
      })
    );
  });
});
