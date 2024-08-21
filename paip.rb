class Paip < Formula
  desc "A CLI that uses an AI to retry failed pip commands based on the output"
  homepage "https://rwilinski.ai"
  version "0.0.1"

  if Hardware::CPU.arm?
    url "https://github.com/RafalWilinski/paip/releases/download/v0.0.1/paip-macos-arm64"
    sha256 "arm64_sha256_hash" # Replace with actual SHA256 hash
  else
    url "https://github.com/RafalWilinski/paip/releases/download/v0.0.1/paip-macos-x64"
    sha256 "x64_sha256_hash" # Replace with actual SHA256 hash
  end

  def install
    bin.install "paip-macos-#{Hardware::CPU.arm? ? "arm64" : "x64"}" => "paip"
  end

  test do
    system "#{bin}/paip", "--version"
  end
end