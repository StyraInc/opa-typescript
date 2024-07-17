package batch

import rego.v1

default demo := true

# fail every 100th request
demo := false if input.i % 100 == 0
