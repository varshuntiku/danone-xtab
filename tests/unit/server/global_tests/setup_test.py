import os
import sys
import unittest

testdir = os.path.dirname(__file__)
srcdir = "../../../../docker/services/server/app"
sys.path.insert(0, os.path.abspath(os.path.join(testdir, srcdir)))


class TestSetup(unittest.TestCase):
    def test_setup(self):
        self.assertEqual(True, True)

    def test_envparams(self):
        pass
        # env_params = CodexEnvParams()
        # self.assertEqual(env_params.getEnvParam('REDIS_PORT'), "6479")
        # self.assertEqual(env_params.getAllAccessedParams(), "REDIS_PORT: 6479\n")
