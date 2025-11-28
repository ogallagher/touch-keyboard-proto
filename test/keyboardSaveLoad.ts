import { KeyboardInstance, KeyboardPersistance, KeyboardSize } from '@lib/keyboardDefinition'
import { frthenKeyboard } from '@lib/keyboardDefinitions/eng_frthen'
import KeyLabel, { ZoneKey } from '@lib/keyLabel'
import { describe } from 'mocha'
import assert from 'node:assert'
import { writeFileSync } from 'node:fs'
import path from 'node:path'

const testDirPath = 'test'

describe('keyboard', () => {
  describe('save and load', () => {
    it('saves and loads as json format', () => {
      const frthen1 = new KeyboardInstance(frthenKeyboard, {
        persistance: KeyboardPersistance.Indefinite,
        size: KeyboardSize.Fill,
        name: 'frthen1'
      })

      const frthenStr = frthen1.save()
      writeFileSync(path.join(testDirPath, `${frthen1.keyboard.name}.keyboard.json`), frthenStr)
      const frthen2 = KeyboardInstance.load(frthenStr)
      writeFileSync(path.join(testDirPath, `${frthen1.keyboard.name}-copy.keyboard.json`), frthen2.save())

      assert(
        frthen1.equals(frthen2), 
        `keyboard mismatch before and after save+load`
      )

      frthen2.keyboard.name = 'frthen2'
      assert(frthen1.equals(frthen2, false), `keyboard name-agnostic mismatch before and after rename`)

      const _rthen3 = KeyboardInstance.load(frthenStr, { keyOverrides: [
        {row: 0, col: 0, key: {
          label: new KeyLabel([
            [new ZoneKey('center'), '']
          ])
        }}
      ] })
      assert(
        !frthen1.equals(_rthen3), 
        `keyboards still match after attempting key override`
      )
    })
  })
})